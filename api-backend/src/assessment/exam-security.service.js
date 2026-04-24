const parseForwardedFor = (value) => {
  if (!value || typeof value !== 'string') return null;
  const first = value
    .split(',')
    .map((part) => part.trim())
    .find(Boolean);
  return first || null;
};

export const extractClientIp = (req) => {
  const forwardedFor = parseForwardedFor(req.headers['x-forwarded-for']);
  const realIp = typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'].trim() : null;
  return normalizeIp(forwardedFor || realIp || req.ip || req.connection?.remoteAddress || null);
};

export const normalizeIp = (value) => {
  if (!value || typeof value !== 'string') return null;

  let normalized = value.trim();
  if (!normalized) return null;

  if (normalized.includes(':') && normalized.includes('.')) {
    const mapped = normalized.split(':').pop();
    if (mapped && mapped.includes('.')) {
      normalized = mapped;
    }
  }

  if (normalized === '::1') {
    return '127.0.0.1';
  }

  return normalized;
};

export const getIpFamily = (value) => {
  if (!value) return 'unknown';
  if (value.includes('.')) return 'ipv4';
  if (value.includes(':')) return 'ipv6';
  return 'unknown';
};

export const getNetworkSignature = (value) => {
  if (!value) return null;
  const family = getIpFamily(value);

  if (family === 'ipv4') {
    const parts = value.split('.').filter(Boolean);
    return parts.length >= 2 ? `${parts[0]}.${parts[1]}` : value;
  }

  if (family === 'ipv6') {
    const parts = value.split(':').filter(Boolean);
    return parts.slice(0, 4).join(':') || value;
  }

  return value;
};

const normalizeUserAgent = (value) => (value || '').trim().toLowerCase();

export const detectDeviceClass = (userAgent) => {
  const normalized = normalizeUserAgent(userAgent);
  if (!normalized) return 'unknown';
  if (/ipad|tablet/.test(normalized)) return 'tablet';
  if (/mobi|android|iphone|mobile/.test(normalized)) return 'mobile';
  return 'desktop';
};

export const buildSecurityAssessment = ({
  startIpAddress,
  submitIpAddress,
  startUserAgent,
  submitUserAgent,
  startFingerprint,
  submitFingerprint,
  tabSwitchCount = 0,
  isFullscreen = true,
  submittedLate = false,
  fastSubmission = false,
  extendedDuration = false,
  answerIntegrityVerified = true,
}) => {
  const normalizedStartIp = normalizeIp(startIpAddress);
  const normalizedSubmitIp = normalizeIp(submitIpAddress);
  const startNetwork = getNetworkSignature(normalizedStartIp);
  const submitNetwork = getNetworkSignature(normalizedSubmitIp);
  const startFamily = getIpFamily(normalizedStartIp);
  const submitFamily = getIpFamily(normalizedSubmitIp);
  const startDeviceClass = detectDeviceClass(startUserAgent);
  const submitDeviceClass = detectDeviceClass(submitUserAgent);
  const normalizedStartUserAgent = normalizeUserAgent(startUserAgent);
  const normalizedSubmitUserAgent = normalizeUserAgent(submitUserAgent);

  const ipChanged = Boolean(normalizedStartIp && normalizedSubmitIp && normalizedStartIp !== normalizedSubmitIp);
  const networkChanged = Boolean(startNetwork && submitNetwork && startNetwork !== submitNetwork);
  const familyChanged =
    startFamily !== 'unknown' &&
    submitFamily !== 'unknown' &&
    startFamily !== submitFamily;
  const userAgentChanged = Boolean(
    normalizedStartUserAgent &&
      normalizedSubmitUserAgent &&
      normalizedStartUserAgent !== normalizedSubmitUserAgent
  );
  const fingerprintChanged = Boolean(
    startFingerprint &&
      submitFingerprint &&
      String(startFingerprint) !== String(submitFingerprint)
  );
  const deviceClassChanged =
    startDeviceClass !== 'unknown' &&
    submitDeviceClass !== 'unknown' &&
    startDeviceClass !== submitDeviceClass;

  let riskScore = 0;
  const reasons = [];
  const strengths = [];
  const flags = [];
  let networkAssessment = 'unavailable';
  let deviceAssessment = 'unavailable';

  if (!ipChanged && normalizedStartIp && normalizedSubmitIp) {
    strengths.push('Start and submit requests came from the same IP address.');
    networkAssessment = 'same_ip';
  } else if (ipChanged && !networkChanged) {
    riskScore += 8;
    flags.push('ip_changed_same_network');
    reasons.push('IP address changed within the same broader network range.');
    networkAssessment = 'same_network_shift';
  } else if (networkChanged) {
    if (!fingerprintChanged && !userAgentChanged) {
      riskScore += 14;
      flags.push('network_changed_same_device_signals');
      reasons.push('Network changed, but browser fingerprint and user agent remained stable. This can happen on mobile or unstable networks.');
      networkAssessment = 'network_shift_same_device';
    } else {
      riskScore += 24;
      flags.push('network_changed_with_device_signal_change');
      reasons.push('Network changed together with browser/device signals.');
      networkAssessment = 'network_shift_with_device_change';
    }
  }

  if (familyChanged) {
    riskScore += 6;
    flags.push('ip_family_changed');
    reasons.push(`Connection family changed from ${startFamily.toUpperCase()} to ${submitFamily.toUpperCase()}.`);
  }

  if (!fingerprintChanged && startFingerprint && submitFingerprint) {
    strengths.push('Browser fingerprint stayed consistent between start and submit.');
    deviceAssessment = 'stable_fingerprint';
  } else if (fingerprintChanged) {
    riskScore += 34;
    flags.push('browser_fingerprint_changed');
    reasons.push('Browser fingerprint changed during the session, which can indicate a device or browser change.');
    deviceAssessment = 'fingerprint_changed';
  }

  if (userAgentChanged) {
    if (deviceClassChanged) {
      riskScore += 30;
      flags.push('device_class_changed');
      reasons.push(`User agent changed from ${startDeviceClass} to ${submitDeviceClass}.`);
      deviceAssessment = 'device_class_changed';
    } else {
      riskScore += 14;
      flags.push('user_agent_changed');
      reasons.push('User agent changed during the session.');
      if (deviceAssessment === 'unavailable') {
        deviceAssessment = 'user_agent_changed_same_class';
      }
    }
  }

  if (tabSwitchCount > 0) {
    riskScore += Math.min(tabSwitchCount * 4, 24);
    flags.push('tab_switch_activity');
    reasons.push(`The candidate switched away from the exam tab ${tabSwitchCount} time(s).`);
  } else {
    strengths.push('No tab switching was recorded during the exam.');
  }

  if (!isFullscreen) {
    riskScore += 8;
    flags.push('fullscreen_not_maintained');
    reasons.push('The exam was submitted outside fullscreen mode.');
  } else {
    strengths.push('Fullscreen mode was maintained until submission.');
  }

  if (fastSubmission) {
    riskScore += 18;
    flags.push('fast_submission_pattern');
    reasons.push('Answering speed was unusually fast for the number of questions.');
  }

  if (submittedLate) {
    riskScore += 14;
    flags.push('submitted_after_limit');
    reasons.push('Submission happened after the configured time limit grace window.');
  }

  if (extendedDuration) {
    riskScore += 8;
    flags.push('extended_duration');
    reasons.push('The session duration was much longer than expected.');
  }

  if (!answerIntegrityVerified) {
    riskScore += 20;
    flags.push('answer_integrity_unverified');
    reasons.push('Answer integrity could not be verified confidently.');
  } else {
    strengths.push('Answer integrity hash was successfully generated and stored.');
  }

  riskScore = Math.max(0, Math.min(100, riskScore));

  let riskLevel = 'low';
  if (riskScore >= 60) {
    riskLevel = 'critical';
  } else if (riskScore >= 35) {
    riskLevel = 'high';
  } else if (riskScore >= 15) {
    riskLevel = 'medium';
  }

  const reviewRequired = riskLevel === 'high' || riskLevel === 'critical';

  const summaryParts = [];
  if (riskLevel === 'low') {
    summaryParts.push('Security signals look stable overall.');
  } else if (riskLevel === 'medium') {
    summaryParts.push('Some moderate anomalies were detected and should be reviewed in context.');
  } else {
    summaryParts.push('Multiple high-risk anomalies were detected and this session should be reviewed carefully.');
  }

  if (networkAssessment === 'network_shift_same_device') {
    summaryParts.push('The network changed, but device signals stayed stable, which can happen when someone moves between cellular data and another ISP.');
  } else if (networkAssessment === 'network_shift_with_device_change') {
    summaryParts.push('The network changed alongside browser or device signals.');
  }

  if (deviceAssessment === 'device_class_changed') {
    summaryParts.push('The browser signature suggests a switch between device types.');
  }

  return {
    riskScore,
    riskLevel,
    reviewRequired,
    summary: summaryParts.join(' '),
    reasons,
    strengths,
    flags,
    analysis: {
      normalizedStartIp,
      normalizedSubmitIp,
      startNetwork,
      submitNetwork,
      startFamily,
      submitFamily,
      ipChanged,
      networkChanged,
      familyChanged,
      startDeviceClass,
      submitDeviceClass,
      deviceClassChanged,
      userAgentChanged,
      fingerprintChanged,
      networkAssessment,
      deviceAssessment,
      tabSwitchCount,
      isFullscreen,
      submittedLate,
      fastSubmission,
      extendedDuration,
      answerIntegrityVerified,
    },
  };
};

"use client"

import { useEffect, useState } from "react"

import {
  defaultRecruitmentModuleConfig,
  readRecruitmentModuleConfig,
  type RecruitmentModuleConfig,
  writeRecruitmentModuleConfig,
} from "@/lib/partner-recruitment/moduleConfig"

export const useRecruitmentModuleConfig = () => {
  const [config, setConfig] = useState<RecruitmentModuleConfig>(
    defaultRecruitmentModuleConfig,
  )

  useEffect(() => {
    setConfig(readRecruitmentModuleConfig())
  }, [])

  const updateConfig = (
    updater:
      | RecruitmentModuleConfig
      | ((current: RecruitmentModuleConfig) => RecruitmentModuleConfig),
  ) => {
    setConfig((current) => {
      const next = typeof updater === "function" ? updater(current) : updater
      writeRecruitmentModuleConfig(next)
      return next
    })
  }

  return {
    config,
    updateConfig,
  }
}

export default useRecruitmentModuleConfig

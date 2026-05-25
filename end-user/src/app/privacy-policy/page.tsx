import { JSX } from 'react';
import type { Metadata } from 'next';
import LegalContent from './_components/LegalContent';

export const metadata: Metadata = {
  title: 'Privacy Policy | Octobees',
  description:
    'Learn how Octobees collects, uses, protects, and shares your personal information when you use our digital sales assistant and sales ecosystem services.',
};

export default function PrivacyPolicyPage(): JSX.Element {
  return (
    <main>
      <header className="bg-[#C20000]/10 relative">
        <div className="flex flex-col items-center justify-center w-full px-10 pt-32 md:pt-40 pb-16 md:pb-24">
          <div className="w-full md:max-w-7xl space-y-4 text-center">
            <h1 className="text-primary font-bold text-3xl md:text-4xl lg:text-5xl font-heading">
              Privacy Policy
            </h1>
            <p className="text-primary/70 text-sm md:text-base">
              Last Updated: May 25, 2026
            </p>
          </div>
        </div>
      </header>

      <section className="bg-white">
        <div className="w-full md:max-w-4xl md:mx-auto px-6 md:px-10 py-12 md:py-20 space-y-10 text-gray-700 leading-[170%]">
          <LegalContent sections={privacySections} intro={privacyIntro} />
        </div>
      </section>
    </main>
  );
}

const privacyIntro =
  'Octobees ("we", "us", or "our") values the trust you place in us when you share your information. This Privacy Policy explains what personal data we gather, how we make use of it, with whom we share it, and the choices available to you when you interact with our website, products, and services (collectively, the "Services").';

const privacySections = [
  {
    heading: '1. Information We Collect',
    body: [
      'We obtain information in several different ways depending on how you interact with our Services:',
    ],
    list: [
      'Information you provide directly — such as your name, email address, phone number, company details, and any content you submit when registering, requesting a demo, subscribing to our newsletter, or contacting our team.',
      'Information generated from usage — including device identifiers, browser type, IP address, pages visited, referring URLs, time spent on pages, and similar diagnostic data captured automatically.',
      'Content within the platform — any data, files, or materials you upload, create, or process inside our Services in order for us to deliver the functionality you have requested.',
    ],
  },
  {
    heading: '2. How We Use Your Information',
    body: [
      'We process the information described above to operate, maintain, and continuously improve our Services; to deliver customer support and communicate with you about your account, products, or relevant offers; to safeguard the platform against fraud or abuse; and to comply with our legal and regulatory obligations.',
      'We do not sell your personal information to third parties.',
    ],
  },
  {
    heading: '3. Sharing and Disclosure',
    body: [
      'We may share your information with trusted service providers who help us run our business (for example, hosting, analytics, communication, or payment partners), with affiliated entities operating under the Octobees brand, when required by applicable law or a valid government request, or as part of a business transition such as a merger or acquisition. In every case, recipients are expected to handle your information consistently with this Policy.',
    ],
  },
  {
    heading: '4. Cookies and Similar Technologies',
    body: [
      'Our website uses cookies and comparable tracking technologies to remember your preferences, measure how visitors engage with our pages, and improve overall performance. You can manage cookie behaviour through your browser settings; please note that disabling cookies may affect certain features of the Services.',
    ],
  },
  {
    heading: '5. Data Retention',
    body: [
      'We retain your personal information only for as long as needed to deliver the Services, to maintain our business records, to resolve disputes, and to meet legal or regulatory obligations. When information is no longer required, we will securely delete or anonymise it.',
    ],
  },
  {
    heading: '6. Data Security',
    body: [
      'We apply reasonable technical and organisational safeguards designed to protect your personal information from loss, misuse, unauthorised access, alteration, or disclosure. While no method of transmission or storage is completely secure, we work continually to improve the protection of the data entrusted to us.',
    ],
  },
  {
    heading: '7. Your Rights and Choices',
    body: [
      'Subject to applicable laws, you may have the right to request access to, correction of, deletion of, or restriction on the processing of your personal information, as well as the right to object to certain processing activities or request a portable copy of your data. To exercise any of these rights, contact us using the details provided at the bottom of this page.',
    ],
  },
  {
    heading: '8. Children’s Privacy',
    body: [
      'Our Services are not directed to individuals under the age of 18, and we do not knowingly collect personal information from minors. If you believe a child has provided us with personal data, please contact us and we will take prompt steps to remove it.',
    ],
  },
  {
    heading: '9. International Data Transfers',
    body: [
      'Our infrastructure and partners may operate in jurisdictions outside your country of residence. When we transfer personal information across borders, we apply appropriate safeguards to ensure your data continues to receive an adequate level of protection.',
    ],
  },
  {
    heading: '10. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. Any updates will be posted on this page with a revised "Last Updated" date, and where appropriate we will provide additional notice through the Services or by email.',
    ],
  },
  {
    heading: '11. Contact Us',
    body: [
      'If you have questions about this Privacy Policy or about how we handle your personal information, please reach out to us at contact@octobees.com or through the Contact Us page on our website.',
    ],
  },
];

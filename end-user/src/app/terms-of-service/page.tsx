import { JSX } from 'react';
import type { Metadata } from 'next';
import LegalContent from '@/app/privacy-policy/_components/LegalContent';

export const metadata: Metadata = {
  title: 'Terms of Service | Octobees',
  description:
    'Read the Terms of Service that govern your use of the Octobees website, digital sales assistant, and sales ecosystem services.',
};

export default function TermsOfServicePage(): JSX.Element {
  return (
    <main>
      <header className="bg-[#C20000]/10 relative">
        <div className="flex flex-col items-center justify-center w-full px-10 pt-32 md:pt-40 pb-16 md:pb-24">
          <div className="w-full md:max-w-7xl space-y-4 text-center">
            <h1 className="text-primary font-bold text-3xl md:text-4xl lg:text-5xl font-heading">
              Terms of Service
            </h1>
            <p className="text-primary/70 text-sm md:text-base">
              Last Updated: May 25, 2026
            </p>
          </div>
        </div>
      </header>

      <section className="bg-white">
        <div className="w-full md:max-w-4xl md:mx-auto px-6 md:px-10 py-12 md:py-20 space-y-10 text-gray-700 leading-[170%]">
          <LegalContent sections={termsSections} intro={termsIntro} />
        </div>
      </section>
    </main>
  );
}

const termsIntro =
  'These Terms of Service ("Terms") govern your access to and use of the Octobees website, products, and services (collectively, the "Services"). By accessing or using the Services, you agree to be bound by these Terms. If you are using the Services on behalf of a company or other legal entity, you represent that you have the authority to bind that entity to these Terms.';

const termsSections = [
  {
    heading: '1. Acceptance of Terms',
    body: [
      'By creating an account, accessing the website, or otherwise using any part of the Services, you confirm that you have read, understood, and agreed to be bound by these Terms together with any policies referenced herein, including our Privacy Policy. If you do not agree, you must discontinue use of the Services.',
    ],
  },
  {
    heading: '2. Eligibility',
    body: [
      'You must be at least 18 years old, or the age of majority in your jurisdiction, to use the Services. By using the Services you represent and warrant that you meet this requirement and that any information you submit to us is accurate, current, and complete.',
    ],
  },
  {
    heading: '3. Accounts and Security',
    body: [
      'Certain features of the Services require an account. You are responsible for keeping your login credentials confidential and for all activities that occur under your account. Please notify us immediately if you suspect any unauthorised use or security breach involving your account.',
    ],
  },
  {
    heading: '4. Description of Services',
    body: [
      'Octobees provides a digital sales assistant and a broader sales ecosystem designed to help businesses manage their digital presence and accelerate growth. We may update, modify, or discontinue any feature of the Services at any time, with or without prior notice, in our sole discretion.',
    ],
  },
  {
    heading: '5. User Obligations and Acceptable Use',
    body: [
      'You agree to use the Services only for lawful purposes and in accordance with these Terms. In particular, you agree not to:',
    ],
    list: [
      'Violate any applicable law, regulation, or third-party rights;',
      'Upload or transmit content that is unlawful, infringing, defamatory, deceptive, or harmful;',
      'Attempt to interfere with, disrupt, reverse engineer, or gain unauthorised access to any part of the Services;',
      'Use automated tools to scrape, harvest, or otherwise extract data from the Services without our written permission; or',
      'Use the Services in a way that could damage, disable, or impair their performance for other users.',
    ],
  },
  {
    heading: '6. Intellectual Property',
    body: [
      'All rights, title, and interest in and to the Services — including software, designs, logos, trademarks, and content provided by Octobees — are and shall remain the property of Octobees or its licensors. Except for the limited right to use the Services in accordance with these Terms, no licence or right is granted to you, whether by implication or otherwise.',
    ],
  },
  {
    heading: '7. User Content',
    body: [
      'You retain ownership of the content you submit to the Services. By submitting such content, you grant Octobees a worldwide, non-exclusive, royalty-free licence to host, process, transmit, and display that content solely as needed to operate and provide the Services to you.',
    ],
  },
  {
    heading: '8. Fees and Payment',
    body: [
      'Where the Services are offered for a fee, you agree to pay all applicable charges in accordance with the pricing terms presented at the time of purchase. Unless stated otherwise, fees are non-refundable. We may revise our pricing from time to time and will give reasonable advance notice of any material changes.',
    ],
  },
  {
    heading: '9. Disclaimers',
    body: [
      'The Services are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the Services will be uninterrupted, error-free, or completely secure.',
    ],
  },
  {
    heading: '10. Limitation of Liability',
    body: [
      'To the maximum extent permitted by law, Octobees and its affiliates, officers, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or exemplary damages arising out of or relating to your use of, or inability to use, the Services, even if we have been advised of the possibility of such damages.',
    ],
  },
  {
    heading: '11. Indemnification',
    body: [
      'You agree to indemnify, defend, and hold harmless Octobees and its affiliates from any claims, damages, liabilities, costs, or expenses (including reasonable legal fees) arising out of your use of the Services, your violation of these Terms, or your infringement of any third-party right.',
    ],
  },
  {
    heading: '12. Termination',
    body: [
      'We may suspend or terminate your access to the Services at any time, with or without notice, if we reasonably believe that you have breached these Terms or that such action is necessary to protect the Services, our users, or third parties. Upon termination, the rights granted to you under these Terms will immediately end, while any provisions intended to survive (such as intellectual property, disclaimers, and limitations of liability) will continue to apply.',
    ],
  },
  {
    heading: '13. Governing Law and Dispute Resolution',
    body: [
      'These Terms are governed by and construed in accordance with the laws of the Republic of Indonesia, without regard to its conflict-of-laws principles. Any dispute arising out of or in connection with these Terms shall first be addressed through good-faith negotiation; failing resolution, disputes will be submitted to the competent courts located in Indonesia.',
    ],
  },
  {
    heading: '14. Changes to These Terms',
    body: [
      'We may update these Terms from time to time to reflect changes in our Services, business practices, or legal requirements. Any updates will be posted on this page with a revised "Last Updated" date. Your continued use of the Services after such updates constitutes your acceptance of the revised Terms.',
    ],
  },
  {
    heading: '15. Contact Us',
    body: [
      'If you have questions or concerns about these Terms, please contact us at contact@octobees.com or through the Contact Us page on our website.',
    ],
  },
];

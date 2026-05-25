import { JSX } from 'react';

export type LegalSection = {
  heading: string;
  body?: string[];
  list?: string[];
};

type Props = {
  intro?: string;
  sections: LegalSection[];
};

export default function LegalContent({ intro, sections }: Props): JSX.Element {
  return (
    <article className="space-y-10">
      {intro && (
        <p className="text-base md:text-lg text-gray-700 !leading-[170%]">
          {intro}
        </p>
      )}
      {sections.map((section, i) => (
        <section key={i} className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold text-primary font-heading !leading-[140%]">
            {section.heading}
          </h2>
          {section.body?.map((paragraph, j) => (
            <p key={j} className="text-base text-gray-700 !leading-[170%]">
              {paragraph}
            </p>
          ))}
          {section.list && (
            <ul className="list-disc ps-6 space-y-2 text-base text-gray-700 !leading-[170%]">
              {section.list.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}

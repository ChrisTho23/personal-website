import React from 'react';

interface ReferenceProps {
  id: string;
  children: React.ReactNode;
}

export const Reference = ({ id, children }: ReferenceProps) => (
  <a href={`#cite-${id}`}>{children}</a>
);

interface ReferencesProps {
  children: React.ReactNode;
}

export const References = ({ children }: ReferencesProps) => (
  <section>
    <ol>{children}</ol>
  </section>
);
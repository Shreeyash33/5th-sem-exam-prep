'use client';

import React, { ReactNode } from 'react';
import type { SubjectId } from '@/components/layout/Navbar';
import type { SectionId } from '@/components/layout/Sidebar';

/* ─── Subject data map ──────────────────────────────────────────────────────── */
/*
  Each subject JSON is imported here. When a new subject's data is ready,
  add it to the map below — no other file needs to change.
*/

import daaData    from '@/app/data/CSC314_DAA.json';
import sadData    from '@/app/data/CSC315_SAD.json';
import cryptoData from '@/app/data/CSC316_Cryptography.json';
import simData    from '@/app/data/CSC317_Simulation.json';
import webData    from '@/app/data/CSC318_WebTech.json';
import mmData     from '@/app/data/CSC319_Multimedia.json';

const DATA_MAP: Record<SubjectId, unknown> = {
  daa:    daaData,
  sad:    sadData,
  crypto: cryptoData,
  sim:    simData,
  web:    webData,
  mm:     mmData,
};

/* ─── Section label map ─────────────────────────────────────────────────────── */

const SECTION_LABELS: Record<SectionId, string> = {
  'analysis':    'Topic Analysis',
  'important':   'Important Topics',
  'reading':     'Priority Reading List',
  'wildcards':   'Wildcard Topics',
  'past-papers': 'Solved Past Papers',
  'mock':        'Mock Papers',
};

/* ─── Props ─────────────────────────────────────────────────────────────────── */

interface MainContentProps {
  activeSubject: SubjectId;
  activeSection: SectionId;
}

/* ─── Component ─────────────────────────────────────────────────────────────── */

export default function MainContent({
  activeSubject,
  activeSection,
}: MainContentProps) {
  const data = DATA_MAP[activeSubject] as Record<string, unknown>;

  return (
    <div
      style={{
        maxWidth: 'var(--content-max-width)',
        marginInline: 'auto',
        paddingTop: 'var(--space-8)',
      }}
    >
      {/* ── Section heading ── */}
      <div
        style={{
          marginBottom: 'var(--space-6)',
          paddingBottom: 'var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <p
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: 'var(--space-1)',
          }}
        >
          {typeof data.subject === 'string' ? data.subject : activeSubject.toUpperCase()}
        </p>
        <h1
          style={{
            fontSize: 'var(--text-2xl)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            lineHeight: 'var(--leading-tight)',
          }}
        >
          {SECTION_LABELS[activeSection]}
        </h1>
      </div>

      {/* ── Section body ── */}
      <SectionBody
        section={activeSection}
        data={data}
      />
    </div>
  );
}

/* ─── Section body router ───────────────────────────────────────────────────── */

interface SectionBodyProps {
  section: SectionId;
  data: Record<string, unknown>;
}

function SectionBody({ section, data }: SectionBodyProps) {
  switch (section) {
    case 'analysis':
      return <AnalysisSection data={data} />;
    case 'important':
      return <ImportantSection data={data} />;
    case 'reading':
      return <ReadingSection data={data} />;
    case 'wildcards':
      return <WildcardsSection data={data} />;
    case 'past-papers':
      return <PastPapersSection data={data} />;
    case 'mock':
      return <MockSection data={data} />;
    default:
      return null;
  }
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION VIEWS
   Each is a placeholder that renders real structure but surfaces JSON data.
   These will be replaced with full feature components in subsequent tasks.
────────────────────────────────────────────────────────────────────────────── */

function AnalysisSection({ data }: { data: Record<string, unknown> }) {
  const analysis = data.patternAnalysis as Record<string, unknown> | undefined;
  if (!analysis) return <Empty label="No pattern analysis data." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {analysis.notes && (
        <InfoBox>{String(analysis.notes)}</InfoBox>
      )}
      <PriorityGroup
        heading="Guaranteed"
        ids={analysis.guaranteed as string[]}
        topics={data.topics as Topic[]}
        color="var(--color-high)"
        subtleColor="var(--color-high-subtle)"
        textColor="var(--color-high-text)"
      />
      <PriorityGroup
        heading="Likely"
        ids={analysis.likely as string[]}
        topics={data.topics as Topic[]}
        color="var(--color-medium)"
        subtleColor="var(--color-medium-subtle)"
        textColor="var(--color-medium-text)"
      />
      <PriorityGroup
        heading="Wildcards"
        ids={analysis.wildcards as string[]}
        topics={data.topics as Topic[]}
        color="var(--color-low)"
        subtleColor="var(--color-low-subtle)"
        textColor="var(--color-low-text)"
      />
    </div>
  );
}

function ImportantSection({ data }: { data: Record<string, unknown> }) {
  const topics = (data.topics as Topic[] | undefined) ?? [];
  const highPriority = topics.filter((t) => t.priority === 'high');

  return (
    <TopicList
      topics={highPriority}
      emptyLabel="No high priority topics found."
    />
  );
}

function ReadingSection({ data }: { data: Record<string, unknown> }) {
  const analysis = data.patternAnalysis as Record<string, unknown> | undefined;
  const order = (analysis?.priorityOrder as string[] | undefined) ?? [];
  const topics = (data.topics as Topic[] | undefined) ?? [];

  const ordered = order
    .map((id) => topics.find((t) => t.id === id))
    .filter((t): t is Topic => t !== undefined);

  return (
    <TopicList
      topics={ordered}
      numbered
      emptyLabel="No reading order defined."
    />
  );
}

function WildcardsSection({ data }: { data: Record<string, unknown> }) {
  const analysis = data.patternAnalysis as Record<string, unknown> | undefined;
  const ids = (analysis?.wildcards as string[] | undefined) ?? [];
  const topics = (data.topics as Topic[] | undefined) ?? [];
  const wildcards = ids
    .map((id) => topics.find((t) => t.id === id))
    .filter((t): t is Topic => t !== undefined);

  return (
    <TopicList
      topics={wildcards}
      emptyLabel="No wildcard topics defined."
    />
  );
}

function PastPapersSection({ data }: { data: Record<string, unknown> }) {
  const papers = (data.papers as Paper[] | undefined) ?? [];

  if (!papers.length) return <Empty label="No past papers found." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {papers.map((paper) => (
        <PaperBlock key={paper.year} paper={paper} />
      ))}
    </div>
  );
}

function MockSection({ data }: { data: Record<string, unknown> }) {
  const mocks = (data.mockPapers as MockPaper[] | undefined) ?? [];

  if (!mocks.length) return <Empty label="No mock papers found." />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {mocks.map((mock, i) => (
        <PaperBlock
          key={mock.id}
          paper={{ year: `Mock Paper ${i + 1}`, questions: mock.questions }}
        />
      ))}
    </div>
  );
}

/* ─── Shared sub-components ─────────────────────────────────────────────────── */

/* Types matching the JSON schema */
interface Topic {
  id: string;
  name: string;
  unit: string;
  priority: 'high' | 'medium' | 'low';
  appearedIn: { year: string; questionNumbers: number[] }[];
}

interface Question {
  number: number;
  part: string | null;
  topic: string;
  question: string;
  answer: string;
  marks: number;
}

interface Paper {
  year: string;
  questions: Question[];
}

interface MockPaper {
  id: string;
  questions: Question[];
}

/* Empty state */
function Empty({ label }: { label: string }) {
  return (
    <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
      {label}
    </p>
  );
}

/* Info box */
function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-info-subtle)',
        border: '1px solid var(--border-subtle)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-info-text)',
        lineHeight: 'var(--leading-relaxed)',
      }}
    >
      {children}
    </div>
  );
}

/* Priority group (used in AnalysisSection) */
interface PriorityGroupProps {
  heading: string;
  ids: string[];
  topics: Topic[];
  color: string;
  subtleColor: string;
  textColor: string;
}

function PriorityGroup({
  heading,
  ids,
  topics,
  color,
  subtleColor,
  textColor,
}: PriorityGroupProps) {
  if (!ids?.length) return null;

  const matched = ids
    .map((id) => topics?.find((t) => t.id === id))
    .filter((t): t is Topic => t !== undefined);

  return (
    <section aria-labelledby={`group-${heading}`}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-3)',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: color,
          }}
        />
        <h2
          id={`group-${heading}`}
          style={{
            fontSize: 'var(--text-base)',
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {heading}
        </h2>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: subtleColor,
            color: textColor,
          }}
        >
          {matched.length}
        </span>
      </div>

      <ul
        role="list"
        style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-2)',
        }}
      >
        {matched.map((topic) => (
          <li
            key={topic.id}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 'var(--space-3)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  lineHeight: 'var(--leading-snug)',
                }}
              >
                {topic.name}
              </p>
              <p
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--text-tertiary)',
                  marginTop: 2,
                }}
              >
                {topic.unit}
                {topic.appearedIn?.length > 0 &&
                  ` · Appeared ${topic.appearedIn.length}×`}
              </p>
            </div>
            <span
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: subtleColor,
                color: textColor,
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              {topic.priority}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* Topic list (used in Important, Reading, Wildcards) */
interface TopicListProps {
  topics: Topic[];
  numbered?: boolean;
  emptyLabel: string;
}

function TopicList({ topics, numbered, emptyLabel }: TopicListProps) {
  if (!topics.length) return <Empty label={emptyLabel} />;

  const priorityColor: Record<string, string> = {
    high:   'var(--color-high)',
    medium: 'var(--color-medium)',
    low:    'var(--color-low)',
  };
  const prioritySubtle: Record<string, string> = {
    high:   'var(--color-high-subtle)',
    medium: 'var(--color-medium-subtle)',
    low:    'var(--color-low-subtle)',
  };
  const priorityText: Record<string, string> = {
    high:   'var(--color-high-text)',
    medium: 'var(--color-medium-text)',
    low:    'var(--color-low-text)',
  };

  return (
    <ul
      role="list"
      style={{
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2)',
      }}
    >
      {topics.map((topic, idx) => (
        <li
          key={topic.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-3)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          {numbered && (
            <span
              aria-hidden="true"
              style={{
                fontSize: 'var(--text-xs)',
                fontWeight: 500,
                color: 'var(--text-tertiary)',
                minWidth: 20,
                paddingTop: 2,
                flexShrink: 0,
              }}
            >
              {idx + 1}.
            </span>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                color: 'var(--text-primary)',
                lineHeight: 'var(--leading-snug)',
              }}
            >
              {topic.name}
            </p>
            <p
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-tertiary)',
                marginTop: 2,
              }}
            >
              {topic.unit}
              {topic.appearedIn?.length > 0 &&
                ` · Appeared ${topic.appearedIn.length}×`}
            </p>
          </div>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: prioritySubtle[topic.priority] ?? 'var(--bg-sunken)',
              color: priorityText[topic.priority] ?? 'var(--text-secondary)',
              border: `1px solid ${priorityColor[topic.priority] ?? 'transparent'}`,
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {topic.priority}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* Paper block — used in past papers and mock papers */
function PaperBlock({ paper }: { paper: { year: string; questions: Question[] } }) {
  return (
    <section aria-labelledby={`paper-${paper.year}`}>
      <h2
        id={`paper-${paper.year}`}
        style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 600,
          color: 'var(--text-primary)',
          marginBottom: 'var(--space-4)',
          paddingBottom: 'var(--space-3)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        {paper.year}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {paper.questions.map((q) => (
          <QuestionCard key={`${q.number}-${q.part ?? ''}`} question={q} />
        ))}
      </div>
    </section>
  );
}

/* Question card with show/hide answer */
function QuestionCard({ question }: { question: Question }) {
  const [showAnswer, setShowAnswer] = React.useState(false);
  const label = question.part
    ? `Q${question.number}${question.part}`
    : `Q${question.number}`;

  return (
    <article
      aria-label={`${label}: ${question.question.slice(0, 60)}…`}
      style={{
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        background: 'var(--bg-surface)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-3)',
          padding: 'var(--space-4)',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontSize: 'var(--text-xs)',
            fontWeight: 600,
            color: 'var(--color-primary)',
            background: 'var(--color-primary-subtle)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          {label}
        </span>
        <p
          style={{
            fontSize: 'var(--text-sm)',
            color: 'var(--text-primary)',
            lineHeight: 'var(--leading-relaxed)',
            flex: 1,
          }}
        >
          {question.question}
        </p>
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-tertiary)',
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          {question.marks}m
        </span>
      </div>

      {/* Answer toggle */}
      <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <button
          type="button"
          aria-expanded={showAnswer}
          onClick={() => setShowAnswer((p) => !p)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            width: '100%',
            padding: 'var(--space-3) var(--space-4)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            fontFamily: 'var(--font-sans)',
            textAlign: 'left',
            transition: 'background-color var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'var(--bg-hover)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
              'transparent';
          }}
        >
          <svg
            aria-hidden="true"
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{
              transform: showAnswer ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform var(--transition-base)',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
          {showAnswer ? 'Hide answer' : 'Show answer'}
        </button>

        {showAnswer && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-4) var(--space-4)',
              fontSize: 'var(--text-sm)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--leading-relaxed)',
              borderTop: '1px solid var(--border-subtle)',
              background: 'var(--bg-elevated)',
              whiteSpace: 'pre-wrap',
            }}
          >
            {question.answer}
          </div>
        )}
      </div>
    </article>
  );
}
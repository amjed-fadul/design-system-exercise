import '@design-system-exercise/react/styles.css';
import '@design-system-exercise/tokens/css';

import { ApplicationShell } from '@design-system-exercise/patterns';
import {
  Button,
  Dialog,
  EmptyState,
  InlineFeedback,
  PageHeading,
  RadioGroup,
  SearchField,
  SidePanel,
  StatusBadge,
  Table,
  TextField,
  TopNavbar,
  Sidebar,
} from '@design-system-exercise/react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Theme = 'light' | 'dark';
type ViewportMode = 'auto' | 'expanded' | 'compact';
type AccessScope = 'read-only' | 'read-write';
type KeyStatus = 'Active' | 'Revoked';
type FeedbackKind = 'created' | 'revoked';

type ApiKeyRecord = {
  id: string;
  name: string;
  prefix: string | null;
  scope: AccessScope;
  status: KeyStatus;
  createdBy: string;
  createdAt: string | null;
  evaluationOnly?: boolean;
};

export type ApiKeysEvaluationProps = {
  language?: Language;
  theme?: Theme;
  viewportMode?: ViewportMode;
  initialQuery?: string;
  initialDialog?: 'create' | 'detail' | 'revoke' | null;
  initialDetailKeyId?: string;
  initialCreateAttempted?: boolean;
  initialFeedback?: FeedbackKind | null;
  initialCreatedKey?: boolean;
  initialRevokedKeyId?: string;
};

const INITIAL_KEYS: ApiKeyRecord[] = [
  {
    id: 'prod-deploy',
    name: 'Production deploy',
    prefix: 'nsk_prod_7H2',
    scope: 'read-write',
    status: 'Active',
    createdBy: 'Amal Hassan',
    createdAt: null,
  },
  {
    id: 'analytics-reader',
    name: 'Analytics reader',
    prefix: 'nsk_analytics_4F9',
    scope: 'read-only',
    status: 'Active',
    createdBy: 'Sara Ahmed',
    createdAt: null,
  },
  {
    id: 'legacy-integration',
    name: 'Legacy integration',
    prefix: 'nsk_legacy_2K1',
    scope: 'read-only',
    status: 'Revoked',
    createdBy: 'Amal Hassan',
    createdAt: null,
  },
];

const COPY = {
  en: {
    direction: 'ltr' as const,
    workspace: 'Workspace',
    shellContext: 'Workspace administration',
    apiKeys: 'API keys',
    pageDescription: 'Create and manage credentials for workspace integrations.',
    createKey: 'Create API key',
    searchLabel: 'Search API keys by name or prefix',
    searchPlaceholder: 'Search by name or prefix',
    clearSearch: 'Clear search',
    resultSummary: (count: number, total: number) => `${count} of ${total} keys`,
    nameAndPrefix: 'Name and prefix',
    accessScope: 'Access scope',
    status: 'Status',
    details: 'Details',
    emptyTitle: 'No API keys found',
    emptyBody: 'Try another key name or prefix, or clear the search to see every key.',
    clearSearchAction: 'Clear search',
    detailEyebrow: 'API key details',
    closePanel: 'Close API key details',
    keyName: 'Name',
    keyPrefix: 'Key prefix',
    prefixNotAllocated: 'No prefix is allocated in this evaluation.',
    evaluationOnly: 'Evaluation only',
    evaluationPlaceholder: 'Not allocated',
    scope: 'Access scope',
    createdBy: 'Created by',
    createdOn: 'Created date',
    dateNotSupplied: 'Not supplied in evaluation data',
    you: 'You',
    readOnly: 'Read only',
    readWrite: 'Read and write',
    active: 'Active',
    revoked: 'Revoked',
    revokeKey: 'Revoke API key',
    createDialogTitle: 'Create API key',
    createDialogDescription: 'Choose a name and the access this key needs.',
    createNameLabel: 'Key name',
    createNameHint: 'Use a name that helps you recognize this key.',
    nameRequired: 'Enter a key name.',
    scopeRequired: 'Choose an access scope.',
    cancel: 'Cancel',
    create: 'Create key',
    closeDialog: 'Close dialog',
    createFeedback:
      'Key created in this evaluation. No production token was generated or stored.',
    revokeFeedback: (name: string) => `${name} was revoked in this evaluation.`,
    confirmTitle: 'Revoke API key?',
    confirmDescription: (name: string) =>
      `Requests using ${name} will stop working. This action cannot be undone.`,
    confirmRevoke: 'Revoke key',
    narrowDetailsUnresolved:
      'The narrow-screen detail presentation is unresolved. Open this record in the wide presentation to inspect its details.',
  },
  ar: {
    direction: 'rtl' as const,
    workspace: 'مساحة العمل',
    shellContext: 'إدارة مساحة العمل',
    apiKeys: 'مفاتيح API',
    pageDescription: 'أنشئ بيانات اعتماد تكاملات مساحة العمل وأدرها.',
    createKey: 'إنشاء مفتاح API',
    searchLabel: 'ابحث في مفاتيح API بالاسم أو البادئة',
    searchPlaceholder: 'ابحث بالاسم أو البادئة',
    clearSearch: 'مسح البحث',
    resultSummary: (count: number, total: number) => `${count} من أصل ${total} مفاتيح`,
    nameAndPrefix: 'الاسم والبادئة',
    accessScope: 'نطاق الوصول',
    status: 'الحالة',
    details: 'التفاصيل',
    emptyTitle: 'لم يتم العثور على مفاتيح API',
    emptyBody: 'جرّب اسم مفتاح أو بادئة أخرى، أو امسح البحث لعرض كل المفاتيح.',
    clearSearchAction: 'مسح البحث',
    detailEyebrow: 'تفاصيل مفتاح API',
    closePanel: 'إغلاق تفاصيل مفتاح API',
    keyName: 'الاسم',
    keyPrefix: 'بادئة المفتاح',
    prefixNotAllocated: 'لم يتم تخصيص بادئة في هذا التقييم.',
    evaluationOnly: 'للتقييم فقط',
    evaluationPlaceholder: 'غير مخصصة',
    scope: 'نطاق الوصول',
    createdBy: 'أنشأه',
    createdOn: 'تاريخ الإنشاء',
    dateNotSupplied: 'غير متوفر في بيانات التقييم',
    you: 'أنت',
    readOnly: 'للقراءة فقط',
    readWrite: 'للقراءة والكتابة',
    active: 'نشط',
    revoked: 'ملغى',
    revokeKey: 'إلغاء مفتاح API',
    createDialogTitle: 'إنشاء مفتاح API',
    createDialogDescription: 'اختر اسماً ونطاق الوصول الذي يحتاجه هذا المفتاح.',
    createNameLabel: 'اسم المفتاح',
    createNameHint: 'اختر اسماً يساعدك على تمييز هذا المفتاح.',
    nameRequired: 'أدخل اسم المفتاح.',
    scopeRequired: 'اختر نطاق الوصول.',
    cancel: 'إلغاء',
    create: 'إنشاء المفتاح',
    closeDialog: 'إغلاق النافذة',
    createFeedback:
      'تم إنشاء المفتاح في هذا التقييم. لم يتم إنشاء رمز إنتاج أو تخزينه.',
    revokeFeedback: (name: string) => `تم إلغاء ${name} في هذا التقييم.`,
    confirmTitle: 'إلغاء مفتاح API؟',
    confirmDescription: (name: string) =>
      `ستتوقف الطلبات التي تستخدم ${name} عن العمل. لا يمكن التراجع عن هذا الإجراء.`,
    confirmRevoke: 'إلغاء المفتاح',
    narrowDetailsUnresolved:
      'لم يُحسم عرض التفاصيل على الشاشات الضيقة. افتح السجل في العرض الواسع لمعاينة التفاصيل.',
  },
};

function readExpandedBreakpoint(): string {
  if (typeof document === 'undefined') return '1200px';
  const breakpoint = getComputedStyle(document.documentElement)
    .getPropertyValue('--dse-layout-primitive-breakpoint-expanded-shell')
    .trim();
  return breakpoint || '1200px';
}

function useExpandedViewport(viewportMode: ViewportMode): boolean {
  const [matchesExpandedBreakpoint, setMatchesExpandedBreakpoint] = useState(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return true;
    return window.matchMedia(`(min-width: ${readExpandedBreakpoint()})`).matches;
  });

  useEffect(() => {
    if (viewportMode !== 'auto' || typeof window.matchMedia !== 'function') return;
    const mediaQuery = window.matchMedia(`(min-width: ${readExpandedBreakpoint()})`);
    const update = () => setMatchesExpandedBreakpoint(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, [viewportMode]);

  if (viewportMode === 'expanded') return true;
  if (viewportMode === 'compact') return false;
  return matchesExpandedBreakpoint;
}

function formatCreatedDate(value: string, language: Language): string {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar' : 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(value));
}

function scopeLabel(scope: AccessScope, copy: (typeof COPY)[Language]): string {
  return scope === 'read-only' ? copy.readOnly : copy.readWrite;
}

function statusLabel(status: KeyStatus, copy: (typeof COPY)[Language]): string {
  return status === 'Active' ? copy.active : copy.revoked;
}

function ApiKeyNavigationIcon(): ReactNode {
  return (
    <svg
      aria-hidden="true"
      className="api-keys-navigation-icon"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="15" r="4" />
      <path d="m11 12 8-8 2 2-2 2 2 2-3 3-2-2-2 2" />
    </svg>
  );
}

export function ApiKeysEvaluation({
  language = 'en',
  theme = 'light',
  viewportMode = 'auto',
  initialQuery = '',
  initialDialog = null,
  initialDetailKeyId,
  initialCreateAttempted = false,
  initialFeedback = null,
  initialCreatedKey = false,
  initialRevokedKeyId,
}: ApiKeysEvaluationProps) {
  const copy = COPY[language];
  const widePresentation = useExpandedViewport(viewportMode);
  const detailInitiallyOpen = initialDialog === 'detail' || initialDialog === 'revoke';
  const initialSelectedId = detailInitiallyOpen
    ? initialDetailKeyId ?? 'prod-deploy'
    : null;
  const [keys, setKeys] = useState<ApiKeyRecord[]>(() => {
    const fixtureKeys = INITIAL_KEYS.map((key) =>
      key.id === initialRevokedKeyId ? { ...key, status: 'Revoked' as const } : key,
    );
    if (!initialCreatedKey) return fixtureKeys;
    return [
      {
        id: 'evaluation-created-key',
        name: 'Evaluation key',
        prefix: null,
        scope: 'read-write',
        status: 'Active',
        createdBy: copy.you,
        createdAt: new Date().toISOString(),
        evaluationOnly: true,
      },
      ...fixtureKeys,
    ];
  });
  const [query, setQuery] = useState(initialQuery);
  const [createOpen, setCreateOpen] = useState(initialDialog === 'create');
  const [detailId, setDetailId] = useState<string | null>(initialSelectedId);
  const [revokeOpen, setRevokeOpen] = useState(initialDialog === 'revoke');
  const [createAttempted, setCreateAttempted] = useState(initialCreateAttempted);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState<AccessScope | null>(null);
  const [feedback, setFeedback] = useState<FeedbackKind | null>(initialFeedback);
  const [feedbackKeyId, setFeedbackKeyId] = useState<string | null>(
    initialFeedback === 'revoked' ? initialRevokedKeyId ?? 'prod-deploy' : null,
  );
  const [detailsAuthorityNote, setDetailsAuthorityNote] = useState(
    Boolean(initialSelectedId) && !widePresentation,
  );
  const detailHostRef = useRef<HTMLDivElement>(null);
  const detailTitleRef = useRef<HTMLHeadingElement>(null);
  const detailTriggerRef = useRef<HTMLButtonElement | null>(null);
  const wasDetailVisibleRef = useRef(false);
  const originalDocumentContextRef = useRef<{ dir: string | null; theme: string | null } | null>(null);
  const locale = language === 'ar' ? 'ar' : 'en';

  useEffect(() => {
    const root = document.documentElement;
    if (!originalDocumentContextRef.current) {
      originalDocumentContextRef.current = {
        dir: root.getAttribute('dir'),
        theme: root.getAttribute('data-theme'),
      };
    }
    root.setAttribute('dir', copy.direction);
    root.setAttribute('data-theme', theme);

    return () => {
      const original = originalDocumentContextRef.current;
      if (!original) return;
      if (original.dir === null) root.removeAttribute('dir');
      else root.setAttribute('dir', original.dir);
      if (original.theme === null) root.removeAttribute('data-theme');
      else root.setAttribute('data-theme', original.theme);
    };
  }, [copy.direction, theme]);

  const selectedKey = keys.find((key) => key.id === detailId) ?? null;
  const detailVisible = Boolean(selectedKey && widePresentation);
  const filteredKeys = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(locale);
    if (!normalizedQuery) return keys;
    return keys.filter((key) => {
      const searchableText = `${key.name} ${key.prefix ?? ''}`.toLocaleLowerCase(locale);
      return searchableText.includes(normalizedQuery);
    });
  }, [keys, locale, query]);

  useEffect(() => {
    if (widePresentation) setDetailsAuthorityNote(false);
    else if (detailId) setDetailsAuthorityNote(true);
  }, [detailId, widePresentation]);

  useLayoutEffect(() => {
    if (detailVisible) {
      if (!wasDetailVisibleRef.current) {
        const firstControl = detailHostRef.current?.querySelector<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        firstControl?.focus();
      }
      wasDetailVisibleRef.current = true;
      return;
    }

    if (selectedKey && !widePresentation) {
      wasDetailVisibleRef.current = false;
      return;
    }

    if (detailTriggerRef.current) {
      const trigger = detailTriggerRef.current;
      if (trigger?.isConnected) trigger.focus();
      detailTriggerRef.current = null;
    }
    wasDetailVisibleRef.current = false;
  }, [detailVisible, selectedKey?.id]);

  const openCreateDialog = () => {
    setNewKeyName('');
    setNewKeyScope(null);
    setCreateAttempted(false);
    setFeedback(null);
    setFeedbackKeyId(null);
    setCreateOpen(true);
  };

  const handleCreate = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setCreateAttempted(true);
    const trimmedName = newKeyName.trim();
    if (!trimmedName || !newKeyScope) return;

    const newKey: ApiKeyRecord = {
      id: `evaluation-${Date.now()}`,
      name: trimmedName,
      prefix: null,
      scope: newKeyScope,
      status: 'Active',
      createdBy: copy.you,
      createdAt: new Date().toISOString(),
      evaluationOnly: true,
    };
    setKeys((currentKeys) => [newKey, ...currentKeys]);
    setQuery('');
    setFeedback('created');
    setFeedbackKeyId(null);
    setDetailsAuthorityNote(false);
    setCreateOpen(false);
  };

  const openDetails = (
    key: ApiKeyRecord,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    if (!widePresentation) {
      setDetailsAuthorityNote(true);
      return;
    }
    detailTriggerRef.current = event.currentTarget;
    setFeedback(null);
    setDetailsAuthorityNote(false);
    setDetailId(key.id);
  };

  const closeDetails = () => setDetailId(null);

  const handleDetailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (revokeOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeDetails();
      return;
    }
    if (event.key !== 'Tab') return;

    const host = detailHostRef.current;
    if (!host) return;
    const focusableElements = Array.from(
      host.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const active = document.activeElement;

    if (!first || !last) {
      event.preventDefault();
      host.focus();
    } else if (event.shiftKey && (active === first || active === host)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || active === host)) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleRevoke = () => {
    if (!selectedKey || selectedKey.status !== 'Active') return;
    setKeys((currentKeys) =>
      currentKeys.map((key) =>
        key.id === selectedKey.id ? { ...key, status: 'Revoked' } : key,
      ),
    );
    setRevokeOpen(false);
    setFeedback('revoked');
    setFeedbackKeyId(selectedKey.id);
    window.requestAnimationFrame(() => detailTitleRef.current?.focus());
  };

  const rows = filteredKeys.map((key) => ({
    id: key.id,
    primary: (
      <div className="api-key-primary">
        <span className="api-key-name">{key.name}</span>
        <span className="api-key-prefix-line">
          <code className="api-key-prefix" dir="ltr">
            {key.prefix ?? copy.evaluationPlaceholder}
          </code>
          {key.evaluationOnly ? (
            <span className="api-key-evaluation-label">{copy.evaluationOnly}</span>
          ) : null}
        </span>
      </div>
    ),
    secondary: scopeLabel(key.scope, copy),
    status: <StatusBadge label={statusLabel(key.status, copy)} />,
    action: (
      <Button
        emphasis="text"
        onClick={(event) => openDetails(key, event)}
      >
        {copy.details}
        <span className="api-keys-visually-hidden"> {key.name}</span>
      </Button>
    ),
    selected: detailVisible && selectedKey?.id === key.id,
  }));

  const createForm = (
    <form
      className="api-key-create-form"
      id="api-key-create-form"
      noValidate
      onSubmit={handleCreate}
    >
      <TextField
        autoComplete="off"
        errorMessage={copy.nameRequired}
        id="api-key-name"
        invalid={createAttempted && !newKeyName.trim()}
        label={copy.createNameLabel}
        name="name"
        onChange={(event) => setNewKeyName(event.currentTarget.value)}
        required
        supportingText={copy.createNameHint}
        value={newKeyName}
      />
      <div className="api-key-scope-field">
        <RadioGroup
          label={copy.accessScope}
          name="scope"
          onValueChange={(value) => setNewKeyScope(value as AccessScope)}
          options={[
            { value: 'read-only', label: copy.readOnly },
            { value: 'read-write', label: copy.readWrite },
          ]}
          required
          value={newKeyScope ?? undefined}
        />
        {createAttempted && !newKeyScope ? (
          <p className="api-key-scope-error" role="alert">
            {copy.scopeRequired}
          </p>
        ) : null}
      </div>
    </form>
  );

  const detailTitleId = selectedKey ? `api-key-detail-${selectedKey.id}` : undefined;

  return (
    <div className="api-keys-evaluation" data-theme={theme} dir={copy.direction}>
      <div
        aria-hidden={detailVisible ? true : undefined}
        className="api-keys-shell-root"
        inert={detailVisible}
      >
        <ApplicationShell
          pageHeading={
            <PageHeading
              actions={
                <Button onClick={openCreateDialog}>{copy.createKey}</Button>
              }
              description={copy.pageDescription}
              title={copy.apiKeys}
            />
          }
          sidebar={
            <Sidebar
              currentId="api-keys"
              items={[
                {
                  id: 'api-keys',
                  label: copy.apiKeys,
                  href: '#api-keys-management',
                  icon: <ApiKeyNavigationIcon />,
                },
              ]}
              label={copy.workspace}
            />
          }
          topNavbar={
            <TopNavbar
              brand={
                <span className="api-keys-brand" dir="ltr">
                  Northstar
                </span>
              }
              contextLabel={copy.shellContext}
            />
          }
          viewportMode={viewportMode}
        >
          <div className="api-keys-page-content" id="api-keys-management">
            <div className="api-keys-directory-controls">
              <div className="api-keys-search">
                <SearchField
                  aria-label={copy.searchLabel}
                  clearButtonLabel={copy.clearSearch}
                  dir="auto"
                  onChange={(event) => setQuery(event.currentTarget.value)}
                  onClear={() => setQuery('')}
                  placeholder={copy.searchPlaceholder}
                  value={query}
                />
              </div>
              <p aria-live="polite" className="api-keys-result-summary">
                {copy.resultSummary(filteredKeys.length, keys.length)}
              </p>
            </div>

            {detailsAuthorityNote ? (
              <p className="api-keys-authority-note" role="status">
                {copy.narrowDetailsUnresolved}
              </p>
            ) : null}

            {filteredKeys.length > 0 ? (
              <div className="api-keys-table-overflow">
                <Table
                  actionLabel={copy.details}
                  primaryLabel={copy.nameAndPrefix}
                  rows={rows}
                  secondaryLabel={copy.accessScope}
                  statusLabel={copy.status}
                />
              </div>
            ) : (
              <EmptyState
                actions={
                  <Button emphasis="secondary" onClick={() => setQuery('')}>
                    {copy.clearSearchAction}
                  </Button>
                }
                body={copy.emptyBody}
                title={copy.emptyTitle}
              />
            )}

            {feedback === 'created' ? (
              <InlineFeedback intent="success" message={copy.createFeedback} />
            ) : null}
            {feedback === 'revoked' && feedbackKeyId ? (
              <InlineFeedback
                intent="success"
                message={copy.revokeFeedback(
                  keys.find((key) => key.id === feedbackKeyId)?.name ?? copy.apiKeys,
                )}
              />
            ) : null}
          </div>
        </ApplicationShell>
      </div>

      {detailVisible && selectedKey ? (
        <div
          aria-labelledby={detailTitleId}
          aria-modal="true"
          className="api-keys-detail-host"
          onKeyDown={handleDetailKeyDown}
          ref={detailHostRef}
          role="dialog"
          tabIndex={-1}
        >
          <SidePanel
            className="api-keys-detail-panel"
            closeLabel={copy.closePanel}
            eyebrow={copy.detailEyebrow}
            header={
              <div className="api-keys-detail-heading">
                <h2 id={detailTitleId} ref={detailTitleRef} tabIndex={-1}>
                  {selectedKey.name}
                </h2>
                <p>{scopeLabel(selectedKey.scope, copy)}</p>
              </div>
            }
            onClose={closeDetails}
            actions={
              selectedKey.status === 'Active' ? (
                <Button
                  emphasis="secondary"
                  onClick={() => setRevokeOpen(true)}
                  tone="critical"
                >
                  {copy.revokeKey}
                </Button>
              ) : null
            }
          >
            <dl className="api-keys-detail-fields">
              <div>
                <dt>{copy.keyName}</dt>
                <dd>{selectedKey.name}</dd>
              </div>
              <div>
                <dt>{copy.keyPrefix}</dt>
                <dd>
                  <code className="api-key-prefix" dir="ltr">
                    {selectedKey.prefix ?? copy.evaluationPlaceholder}
                  </code>
                  {selectedKey.evaluationOnly ? (
                    <span className="api-key-evaluation-note">
                      {copy.prefixNotAllocated}
                    </span>
                  ) : null}
                </dd>
              </div>
              <div>
                <dt>{copy.scope}</dt>
                <dd>{scopeLabel(selectedKey.scope, copy)}</dd>
              </div>
              <div>
                <dt>{copy.status}</dt>
                <dd>
                  <StatusBadge label={statusLabel(selectedKey.status, copy)} />
                </dd>
              </div>
              <div>
                <dt>{copy.createdBy}</dt>
                <dd>{selectedKey.createdBy}</dd>
              </div>
              <div>
                <dt>{copy.createdOn}</dt>
                <dd>
                  {selectedKey.createdAt
                    ? formatCreatedDate(selectedKey.createdAt, language)
                    : copy.dateNotSupplied}
                </dd>
              </div>
            </dl>
          </SidePanel>
        </div>
      ) : null}

      <Dialog
        actions={
          <>
            <Button emphasis="secondary" onClick={() => setRevokeOpen(false)}>
              {copy.cancel}
            </Button>
            <Button onClick={handleRevoke} tone="critical">
              {copy.confirmRevoke}
            </Button>
          </>
        }
        closeLabel={copy.closeDialog}
        description={
          selectedKey ? copy.confirmDescription(selectedKey.name) : undefined
        }
        onOpenChange={setRevokeOpen}
        open={revokeOpen && detailVisible && selectedKey?.status === 'Active'}
        title={copy.confirmTitle}
      >
        {selectedKey ? (
          <p className="api-keys-revoke-summary">
            <strong>{selectedKey.name}</strong>
            <code className="api-key-prefix" dir="ltr">
              {selectedKey.prefix ?? copy.evaluationPlaceholder}
            </code>
            {selectedKey.evaluationOnly ? (
              <span className="api-key-evaluation-label">{copy.evaluationOnly}</span>
            ) : null}
          </p>
        ) : null}
      </Dialog>

      <Dialog
        actions={
          <>
            <Button emphasis="secondary" onClick={() => setCreateOpen(false)}>
              {copy.cancel}
            </Button>
            <Button onClick={() => handleCreate()}>
              {copy.create}
            </Button>
          </>
        }
        closeLabel={copy.closeDialog}
        description={copy.createDialogDescription}
        onOpenChange={setCreateOpen}
        open={createOpen}
        title={copy.createDialogTitle}
      >
        {createForm}
      </Dialog>
    </div>
  );
}

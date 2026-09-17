import { Link } from '../../link/Link.js';

interface BreadcrumbLinkItemProps {
  label: string;
  href: string;
}

export function BreadcrumbLinkItem({ label, href }: BreadcrumbLinkItemProps) {
  return (
    <span className="dse-breadcrumb-link-item">
      <Link href={href}>{label}</Link>
      <span className="dse-breadcrumb-link-item__separator" aria-hidden="true">
        /
      </span>
    </span>
  );
}

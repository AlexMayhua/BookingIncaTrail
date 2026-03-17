import dynamic from 'next/dynamic';

const ReactAdminApp = dynamic(() => import('@/admin/ReactAdminApp'), {
  ssr: false,
});

export default function AdminReactAdminPage() {
  return <ReactAdminApp />;
}

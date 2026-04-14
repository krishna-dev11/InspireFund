function PageWrapper({ children, className = "" }) {
  return <div className={`min-h-screen app-bg ${className}`}>{children}</div>;
}

export default PageWrapper;

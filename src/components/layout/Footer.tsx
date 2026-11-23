export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/40 bg-white/30 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h4 className="mb-3 font-semibold text-brand-700">PoolTechTools</h4>
            <p className="text-sm text-brand-800/70">Fast, mobile-first, offline-capable pool care toolkit.</p>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-brand-700">Tools</h4>
            <ul className="space-y-2 text-sm text-brand-800/70">
              <li>Pool Volume Calculator</li>
              <li>Chemical Calculator</li>
              <li>Chlorine Calculator</li>
              <li>Maintenance Schedule</li>
              <li>Water Test Log</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-brand-700">Pro</h4>
            <ul className="space-y-2 text-sm text-brand-800/70">
              <li>Customer &amp; Pool Management</li>
              <li>Service History &amp; Cloning</li>
              <li>Report Templates</li>
              <li>Business Branding</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-semibold text-brand-700">Legal</h4>
            <ul className="space-y-2 text-sm text-brand-800/70">
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Chemical Disclaimer</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/40 pt-6 text-center text-xs text-brand-800/60">
          © 2026 PoolTechTools. All calculations are mathematical scaling of user-entered label instructions.
        </div>
      </div>
    </footer>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-fence">
      <div className="max-w-6xl mx-auto px-6 py-4 md:h-14 md:py-0 flex flex-col md:flex-row items-center md:justify-between gap-1 md:gap-0">
        <span className="text-xs text-dim font-mono">
          &copy; {new Date().getFullYear()} Muhamad Sayid Amanulloh
        </span>
        <span className="text-xs text-dim font-mono">
          Node.js · React · Arduino
        </span>
      </div>
    </footer>
  )
}

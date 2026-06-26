export default function Footer() {
  return (
    <footer className="border-t border-fence">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
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

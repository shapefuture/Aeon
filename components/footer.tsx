import Link from "next/link"

export function Footer() {
  return (
    <footer className="py-12 bg-black border-t border-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Security
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-white text-sm">
                  Licenses
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4V20M4 12H20" stroke="white" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-medium">Reflect</span>
          </div>

          <div className="text-gray-400 text-sm">© {new Date().getFullYear()} Reflect. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}

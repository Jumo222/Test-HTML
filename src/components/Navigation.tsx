import { Link, useLocation } from 'react-router-dom'

const Navigation: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <nav>
      <ul>
        <li>
          <Link to="/" className={isActive('/')}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" className={isActive('/about')}>
            About
          </Link>
        </li>
        <li>
          <Link to="/addition" className={isActive('/addition')}>
            Addition
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
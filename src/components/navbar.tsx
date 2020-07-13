import React from 'react';
import './css/Navbar.scss';
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand navbar-light bg-light">
      <a href="/" className="navbar-brand">
        <span style={{ color: 'rgb(232, 53, 36)', fontSize: '1.4rem' }}>Type</span>
        <span style={{ color: 'rgb(0, 0, 0)', fontSize: '1.4rem' }}>ORM</span>
      </a>
      <div className="collapse navbar-collapse text-right">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              href="https://join.slack.com/t/typeorm/shared_invite/enQtNDQ1MzA3MDA5MTExLTUxNTZhM2Q4NDNhMjMzNjQ2NGM1ZjI1ZGRkNjJjYzI4OTZjMGYyYTc0MzAxYTdjMWE3ZDIxOWUzZTdlM2QxNTY"
              title="Slack"
              className="nav-link"
            >
              <svg width={18} height={18} role="img" fill="#FF0064" viewBox="0 0 24 24">
                <title id="simpleicons-slack-icon">Slack</title>
                <path d="M9.879 10.995l1.035 3.085 3.205-1.074-1.035-3.074-3.205 1.08v-.017z"></path>
                <path d="M18.824 14.055l-1.555.521.54 1.61c.218.65-.135 1.355-.786 1.574-.15.045-.285.067-.435.063-.511-.015-.976-.338-1.155-.849l-.54-1.607-3.21 1.073.539 1.608c.211.652-.135 1.358-.794 1.575-.15.048-.285.067-.435.064-.51-.015-.976-.34-1.156-.85l-.539-1.619-1.561.524c-.15.045-.285.061-.435.061-.511-.016-.976-.345-1.155-.855-.225-.66.135-1.364.78-1.575l1.56-.525L7.5 11.76l-1.551.525c-.141.048-.285.066-.428.064-.495-.016-.975-.338-1.141-.848-.209-.65.135-1.354.796-1.574l1.56-.52-.54-1.605c-.21-.654.136-1.359.796-1.575.659-.22 1.363.136 1.574.783l.539 1.608L12.3 7.544l-.54-1.605c-.209-.645.135-1.35.789-1.574.652-.211 1.359.135 1.575.791l.54 1.621 1.555-.51c.651-.219 1.356.135 1.575.779.218.654-.135 1.359-.784 1.575l-1.557.524 1.035 3.086 1.551-.516c.652-.211 1.358.135 1.575.795.22.66-.135 1.365-.779 1.574l-.011-.029zm4.171-5.356C20.52.456 16.946-1.471 8.699 1.005.456 3.479-1.471 7.051 1.005 15.301c2.475 8.245 6.046 10.17 14.296 7.694 8.245-2.475 10.17-6.046 7.694-14.296z"></path>
              </svg>
            </a>
          </li>
          <li className="nav-item">
            <a href="https://github.com/typeorm/typeorm" title="GitHub" className="nav-link">
              <svg
                width={18}
                height={18}
                role="img"
                fill="#FF0064"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              ></svg>
            </a>
          </li>
          <li className="nav-item"></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
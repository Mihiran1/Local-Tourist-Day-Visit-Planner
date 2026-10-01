import { IconMapPin } from '@tabler/icons-react';
import Link from 'next/link';
import classes from './Footer.module.css';

const data = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', link: '/' },
      { label: 'All Places', link: '/attractions' },
      { label: 'Map View', link: '/map' },
      { label: 'About Us', link: '/about' },
    ],
  },
  {
    title: 'Plan',
    links: [
      { label: 'Create Visit Plan', link: '/plan' },
      { label: 'My Plans', link: '/my-plans' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Login', link: '/login' },
      { label: 'Register', link: '/signup' },
      { label: 'Admin Dashboard', link: '/admin/dashboard' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.inner}>
        {/* Brand */}
        <div className={classes.brand}>
          <Link href="/" className={classes.logo} aria-label="Travel LK home">
            <span className={classes.logoMark}>
              <IconMapPin size={20} stroke={2} />
            </span>
            <span className={classes.logoText}>Travel LK</span>
          </Link>

          <p className={classes.description}>
            Discover hidden local attractions and plan your perfect day trip across
            Dehiattakandiya with ease and comfort.
          </p>
        </div>

        {/* Link groups */}
        {data.map((group) => (
          <nav key={group.title} className={classes.group} aria-label={group.title}>
            <h3 className={classes.title}>{group.title}</h3>
            <ul className={classes.list}>
              {group.links.map((item) => (
                <li key={item.label}>
                  <Link href={item.link} className={classes.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className={classes.bottom}>
        <div className={classes.bottomInner}>
          <p className={classes.copyright}>
            © {new Date().getFullYear()} Travel LK. University Software Project.
          </p>

          <div className={classes.legal}>
            <a href="#" className={classes.legalLink}>
              Privacy Policy
            </a>
            <a href="#" className={classes.legalLink}>
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
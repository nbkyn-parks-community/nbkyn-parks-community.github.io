// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'nbkyn-parks-community',
  tagline: 'North Brooklyn Community Website',
  url: 'https://nbkyn-parks-community.github.io/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'https://nbkparks.org/wp-content/themes/NBKPA-wp_v2.8.7/favicon/favicon-32x32.png',
  organizationName: 'nbkparks', // Usually your GitHub org/user name.
  projectName: 'nbkyn-parks-community', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        googleAnalytics: {
          trackingID: 'UA-221091127-2',
          anonymizeIP: true,
        },
        docs: {
          routeBasePath: "events",
          path: "events",
          // Please change this to your repo.
          editUrl: 'https://github.com/nbkyn-parks-community/nbkyn-parks-community.github.io/edit/main/events/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/nbkyn-parks-community/nbkyn-parks-community.github.io/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        /**
         * Required for any multi-instance plugin
         */
        id: 'gardens',
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: 'gardens',
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: './gardens/',
        editUrl:
          'https://github.com/nbkyn-parks-community/nbkyn-parks-community.github.io/edit/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        /**
         * Required for any multi-instance plugin
         */
        postsPerPage: "ALL",
        id: 'getting-started',
        /**
         * URL route for the blog section of your site.
         * *DO NOT* include a trailing slash.
         */
        routeBasePath: 'getting-started',
        blogSidebarTitle: 'How To & Contributing',
        /**
         * Path to data on filesystem relative to site dir.
         */
        path: './how-to&contributing',
        editUrl:
          'https://github.com/nbkyn-parks-community/nbkyn-parks-community.github.io/edit/main/',
      },
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'nbkyn-parks-community',
        logo: {
          alt: 'My Site Logo',
          src: 'logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: '🎉 Events',
          },
          { to: '/gardens', 
            docId: 'index',
          label: '🏡 Gardens', position: 'left' },
          { to: '/blog', label: '📋 Community Board', position: 'left' },
          { to: '/getting-started', label: 'Getting Started 🚀', position: 'right' },
          {
            href: 'https://github.com/nbkyn-parks-community/nbkyn-parks-community.github.io',
            label: 'Source',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Events',
            items: [
              {
                label: 'Open Garden Day Info',
                to: '/events/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Community Board',
                to: '/blog',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'Source',
                href: 'https://github.com/nbkyn-parks-community/nbkyn-parks-community.github.io/nbkyn-parks-community',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} nbkyn-parks-community`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;

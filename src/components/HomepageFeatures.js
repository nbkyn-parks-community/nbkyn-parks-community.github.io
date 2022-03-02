import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
}

function Feature({ imageIdx, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <img src={require(`@site/static/urban-gardener/${imageIdx}.png`).default} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}



export default function HomepageFeatures() {
  const [one, two, three] = shuffle(Array.from(Array(12).keys()));
  const FeatureList = [
    {
      imageIdx: one,
      title: 'Open Sourced Project',
      description: (
        <>
          <code> This is an open-sourced project.
          </code>
          <p>
            Want to learn more about how to contribute and use to open source?
            Checkout <a href='https://opensource.guide/how-to-contribute/'>
              How to Contribute to Open Source
            </a>
          </p>
        </>
      ),
    },
    {
      imageIdx: two,
      title: 'Share Info & Updates with Gardeners',
      description: (
        <p>
          <code>open-sourced</code> means that the backend is available to the public to view in the
          {" "}
          <a href='https://nbkyn-parks-community.github.io/'>
            source link.
          </a>
          If you want to make a update checkout the guides on each tab.
        </p>
      ),
    },
    {
      imageIdx: three,
      title: 'Built with Docusaurus',
      description: (
        <>
          Extend or customize your website layout by reusing React.<a href="https://docusaurus.io/">Docusaurus </a>can
          be extended while reusing the same header and footer.
        </>
      ),
    },
  ]
  return (
    <>
      <section className={styles.features}>
        <div className="container">
          <div className="row">
            {FeatureList.map((props, idx) => (
              <Feature key={idx} {...props} />
            ))}
          </div>
        </div>
      </section>
      <div >
        <div className="row">
          <div className='col'></div>
          <div className='col'></div>
          <div className='col'>
            <p> > Images sourced from <a href='https://tympanus.net/codrops/author/mlangella/'>Manuela Langella</a> </p>
          </div>
        </div>
      </div>
    </>
  );
}

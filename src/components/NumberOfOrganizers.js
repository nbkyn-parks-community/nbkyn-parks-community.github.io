import React from 'react'
import cheerio from 'cheerio'
import clsx from 'clsx'

 const getRawData = async (URL) => {
    // return fetch(URL)

    //   .then((response) => response.text())
    //   .then((data) => {
    //     return cheerio.load(data);
    //   });
      const response = await fetch(URL)
      const data = await response.text() 
      return cheerio.load(data)
  };

export default function Feature({ URL }) {
  const [numberOfOrg,changeState] = React.useState(null)
  React.useEffect(() => {
    (async () => {
      try{
      const html = await getRawData(URL);
      changeState(html('.lot-detail-organizers')[0]?.children[1]?.children[0]?.data)
      }catch(e){
        console.error(e);
      }
    })()

  })

  return (
    <div className={clsx('container')}>
      {numberOfOrg ? numberOfOrg : "Loading..." }
      <a href={URL}> source </a>
    </div>
  );
}
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import useBaseUrl from '@docusaurus/useBaseUrl';
import BrowserOnly from '@docusaurus/BrowserOnly';

export default ({ children, imagePath }) => {
    const mapSr = useBaseUrl(imagePath)
    return (
        <BrowserOnly fallback={<div>Loading...</div>}>
            {() => (
                <App
                    children={children}
                    mapSrc={mapSr}
                    trailColor={null}
                    trailWidth={null}
                    trailDash={[2, 4]}
                    trailVisitedColor={'#8EC641'}
                    trailVisitedWidth={4}
                    pointColor={null}
                    pointRadius={null}
                    pointFutureColor={'#ccc'}
                    pointPresentColor={null}
                    pointPastColor={null}
                    fontPastColor={'#666'}
                    fontPresentColor={'#000'}
                    fontFutureColor={'#aaa'}
                />
            )}
        </BrowserOnly>
    )
}

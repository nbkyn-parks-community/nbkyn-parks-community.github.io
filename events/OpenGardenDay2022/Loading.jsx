import React, { useEffect, useState } from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { tada } from "react-animations";
import styled, { keyframes } from "styled-components";


const Animation = keyframes`${tada}`;
const Div = styled.div`
  animation: 1s ${Animation};
`;

export default function MyComponent() {
  const [bool, setBool] = useState(false);
  setTimeout(() => setBool(true), 5000);

  return (
    <>
      <Div>{!bool && <img src={useBaseUrl("/OpenGardenDay2022.gif")} />}</Div>
    </>
  );
}

import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { loremIpsum } from "lorem-ipsum";

const Horizontal = styled.div`
  display: flex;
`;

const Navigation = styled.nav`
  margin: 30px;
`;

const Article = styled.div`
  overflow-y: scroll;
  height: 100vh;
`;

const Anchor = styled.a`
  display: block;
  margin-bottom: 10px;
  text-decoration: none;
  font-size: 22px;

  ${(props) => {
    return (
      props.selected &&
      css`
        border-bottom: 1px solid #000;
        font-weight: bold;
      `
    );
  }}
`;

const App = () => {
  const [things] = useState([
    {
      id: "a",
      headline: "React",
      text: loremIpsum({ count: 50, units: "sentences" }),
    },
    {
      id: "b",
      headline: "Redux",
      text: loremIpsum({ count: 50, units: "sentences" }),
    },
    {
      id: "c",
      headline: "GraphQL",
      text: loremIpsum({ count: 50, units: "sentences" }),
    },
  ]);

  const rootRef = useRef();
  const singleRefs = useRef(
    things.reduce((acc, value) => {
      acc[value.id] = {
        ref: React.createRef(),
        id: value.id,
        ratio: 0,
      };

      return acc;
    }, {})
  ).current;

  const [activeThing, setActiveThing] = useState({ id: null, ratio: 0 });

  useEffect(() => {
    const callback = (entries) => {
      entries.forEach((entry) => {
        singleRefs[entry.target.id].ratio = entry.intersectionRatio;
      });

      const newActiveThing = Object.values(singleRefs).reduce((acc, value) => {
        return value.ratio > acc.ratio ? value : acc;
      }, activeThing);

      if (newActiveThing.ratio > activeThing.ratio) {
        setActiveThing(newActiveThing);
      }
    };

    const observer = new IntersectionObserver(callback, {
      root: rootRef.current,
      threshold: new Array(101).fill(0).map((v, i) => i * 0.01),
    });

    Object.values(singleRefs).forEach((value) => {
      observer.observe(value.ref.current);
    });

    return () => {
      Object.values(singleRefs).forEach((value) => {
        observer.unobserve(value.ref.current);
      });
    };
  }, [activeThing, singleRefs]);

  return (
    <Horizontal>
      <Navigation>
        {things.map((thing) => (
          <div key={thing.id}>
            <Anchor
              href={`#${thing.id}`}
              selected={thing.id === activeThing.id}
            >
              {thing.headline}
            </Anchor>
          </div>
        ))}
      </Navigation>

      <Article ref={rootRef}>
        {things.map((thing) => (
          <div key={thing.id} id={thing.id} ref={singleRefs[thing.id].ref}>
            <h1>{thing.headline}</h1>
            <p>{thing.text}</p>
          </div>
        ))}
      </Article>
    </Horizontal>
  );
};

export default App;

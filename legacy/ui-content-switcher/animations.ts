export const fadeOutAnimation = (element, duration) => {
  const animation = element.animate(
    [{opacity: 1, easing: 'ease-out'}, {opacity: 0.5}, {opacity: 0}],
    {
      duration: duration,
      fill: 'forwards',
    }
  );
  return animation;
};

export const fadeInAnimation = (element, duration) => {
  const animation = element.animate(
    [{opacity: 0, easing: 'ease-in-out'}, {opacity: 0.5}, {opacity: 1}],
    {
      duration: duration,
      fill: 'forwards',
    }
  );
  return animation;
};

export const slideDownAnimation = (element, duration) => {
  const animation = element.animate(
    [
      {transform: 'translateY(-100%)', offset: 0.0},
      {transform: 'translateY(40%)', offset: 0.5},
      {transform: 'translateY(7%)', offset: 0.65},
      {transform: 'translateY(4%)', offset: 0.8},
      {transform: 'translateY(2%)', offset: 0.95},
      {transform: 'translateY(0%)', offset: 1.0},
    ],
    {duration: duration, fill: 'forwards', easing: 'ease'}
  );
  return animation;
};

export const slideLeftAnimation = (element, duration) => {
  const animation = element.animate(
    [
      {transform: 'translateX(100%)', offset: 0.0},
      {transform: 'translateX(40%)', offset: 0.5},
      {transform: 'translateX(7%)', offset: 0.65},
      {transform: 'translateX(4%)', offset: 0.8},
      {transform: 'translateX(2%)', offset: 0.95},
      {transform: 'translateX(0%)', offset: 1.0},
    ],
    {duration: duration, fill: 'forwards', easing: 'ease-in-out'}
  );
  return animation;
};

export const slideRightAnimation = (element, duration) => {
  const animation = element.animate(
    [
      {transform: 'translateX(-100%)', offset: 0.0},
      {transform: 'translateX(-40%)', offset: 0.5},
      {transform: 'translateX(-7%)', offset: 0.65},
      {transform: 'translateX(-4%)', offset: 0.8},
      {transform: 'translateX(-2%)', offset: 0.95},
      {transform: 'translateX(-0%)', offset: 1.0},
    ],
    {duration: duration, fill: 'forwards', easing: 'ease-in-out'}
  );
  return animation;
};

export const stretchLeftAnimation = (element, duration) => {
  const animation = element.animate(
    [
      {transform: 'scaleX(0.3)', offset: 0.0},
      {transform: 'scaleX(1.02)', offset: 0.4},
      {transform: 'scaleX(0.98)', offset: 0.6},
      {transform: 'scaleX(1.01)', offset: 0.8},
      {transform: 'scaleX(0.98)', offset: 1},
      {transform: 'scaleX(1.01)', offset: 1},
      {transform: 'scaleX(1)', offset: 1},
    ],
    {duration: duration, fill: 'forwards', easing: 'ease-out'}
  );
  return animation;
};

import React from 'react';

/** Card renders an image of a card
 * 
 *  Props
 * - image
 * 
 *  CardList -> Card
 */
function Card({image}) {
  return (
    <div>
      <img src={image} />
    </div>
  )
}

export default Card;
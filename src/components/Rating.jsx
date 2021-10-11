import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStar1} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStar2 } from "@fortawesome/free-regular-svg-icons";
import Rating from "react-rating";

const RatingComponent = props => {
  const [isLiked, updateLike] = useState(false);
  const [isDisliked, updateDislike ] = useState(false)
  const [likes, updateLikes] = useState(props.likes)
  const [dislikes, updateDislikes] = useState(props.dislikes)
  const [voted, updateVote] = useState(false)
  const [userRating, udpateUserRating ] = useState(null)
  

  useEffect(
    () => {
      udpateUserRating(props.initialRating)
    }, 
  )

  const handleLike = (e) => {
    e.persist();
    updateLike(true)
    updateDislike(false)
    updateVote(true)
    udpateUserRating(props.initialRating)
    console.log("liked: " + props.initialRating)
    props.getUserRating(props.initialRating)
    //props.parentCallback
  }

  const handeDislike = () => {
    updateLike(false)
    updateDislike(true)
    updateVote(true)
  }
  
  const handleRating = (e) => 
  {
    udpateUserRating(e)
    console.log("mememe" + e)
    props.getUserRating(e)
    //props.parentCallback()
  }

  return (

    <div>
      <div>
        <p
        style = 
        {{ textAlign: "center",
        fontSize: "120%"}}
        ><b> Agree? </b></p>
        <div
        style = {{
          display: 'flex',
          justifyContent: 'center',
          aligntems: 'center'
        }}>
        
        <button
          onClick={handleLike}
          style = {{
            paddingLeft: "22px", 
            paddingRight: "22px",
            paddingBottom: "5px",
            paddingTop: "5px",
            marginRight: "23px",
            marginTop: "5px"
          }}
          >
          <FontAwesomeIcon
            size = '3x'
            icon={faThumbsUp}
            //style={{ paddingRight: 5 }}
          />
        </button>
        <button
          style = {{
            paddingLeft: "22px", 
            paddingRight: "22px",
            paddingBottom: "5px",
            paddingTop: "5px",
            marginTop: "5px"
          }}
          onClick={handeDislike}
          >
          <FontAwesomeIcon
            size = '3x'
            icon={faThumbsDown}
            />
        </button>
        </div>
        
        <p 
        style = 
        {{ textAlign: "center",
        paddingTop: "15px",
        fontSize: "150%"
        }} > {voted && isDisliked ? "What do you think the score is?" : ""} </p>
        <div
        style= {{
          display: 'flex',
          justifyContent: 'center',
          aligntems: 'center'
          }}>
          { voted && isDisliked ?
          < Rating
            style = {{ paddingTop : 15 }}
            stop  = { 10 }
            // emptySymbol = "far fa-star fa-2x"
            // fullSymbol = "fas fa-star fa-2x"
            // emptySymbol="fa fa-star-o fa-2x"
            emptySymbol={<FontAwesomeIcon icon={faStar2} size={"2x"}/>}
            fullSymbol={<FontAwesomeIcon icon={faStar1} size={"2x"}/>}
            // emptySymbol={<img src="../src/assets/images/star-grey.png" className="icon" />}
            // placeholderSymbol={<img src="../src/assets/images/star-red.png" className="icon" />}
            // fullSymbol = {<img src="../src/assets/images/star-red.png" className="icon" />}
            initialRating = { props.initialRating }
            onClick = { handleRating }
            //onHover={(rate) => document.getElementById('label-onrate').innerHTML = rate || ''}
          /> : null   
          }
        </div>
        
      </div>
      { voted ?
        <p 
        style = 
        {{ textAlign: "center",
        paddingTop: "15px",
        fontSize: "150%"
        
        }} > {voted && isLiked? "Great!" :  voted && (userRating !== null) ? "Thank you for the feedback!": null} </p> : null }
      <hr />
    </div>
  );
};


export default RatingComponent;
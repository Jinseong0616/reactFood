import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

import { FaHouse } from 'react-icons/fa6';
import { FaPhoneAlt } from 'react-icons/fa';
import { BiSolidFoodMenu } from 'react-icons/bi';
import { MdAccessTimeFilled } from 'react-icons/md';
import { PiSirenFill } from 'react-icons/pi';

//평점 계산
function calculateAvgRating(reviews) {
  if (!reviews || reviews.length === 0) return 0;

  let totalRating = 0;
  for (let i = 0; i < reviews.length; i++) {
    totalRating += reviews[i].rating;
  }
  return (totalRating / reviews.length).toFixed(1);
}



function DetailMain({ restaurant, reviews, filteredImgList ,restaurantId,userId}) {

  const [zzim, setZzim] = useState(false);
  
  // console.log(restaurantId)
  // console.log(userId)

  useEffect(()=>{
    fetch(`/zzim/users/${userId}/restaurantId/${restaurantId}`)
    .then(response=> response.json())
    .then(data=>{
      setZzim(data.zzim);
      console.log(data)
    })
  },[])

  const handleClick = (e) => {
    const currentZzim = !zzim;
    setZzim(currentZzim);
  

  fetch(`/zzim/users/${userId}/restaurantId/${restaurantId}`, {
    method: currentZzim ? 'POST' : 'DELETE',
  })
    .then(response => response.json())
    .then(data => {
      if (!data.success) {
        setZzim(!zzim);
      }
    })
    .catch(error => {
      console.error('찜 상태 업데이트 중 오류 발생:', error);
      setZzim(!zzim);
    });
  }

  
  const avgRating = calculateAvgRating(reviews);
  const reviewCount = reviews ? reviews.length : 0;
  
  return (
    <div className="restaurantMain container">
      <div className="restaurantInfo">
        <div className="infoImg">
          {filteredImgList &&
            filteredImgList.map((img, index) => {
              return <img key={index} src={`/test/${img.imgUrl}`} alt={`Restaurant Image ${index + 1}`} />;
            })}
        </div>

        <div className="infoName row justify-content-between">
          <div className="detailTitle d-flex">
            <h1 className="col">{restaurant.restaurantName}</h1>
            <div className="col infoShare d-flex">
              <span className="zzimBtn" onClick={handleClick}>
                찜하기
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64">
                  <path
                    fill={zzim ? 'red' : 'none'}
                    stroke="black"
                    strokeWidth="1"
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              </span>
              <button className="col-3 reviewBtn">
              <Link to={`/review/${restaurant.restaurantId}`}>리뷰작성</Link></button>
              <button className="col-3 shareBtn">공유</button>
            </div>
          </div>
        </div>

        <div className="restaurantCategory">
          <a>{restaurant.restaurantAddress}</a>
          <a> {restaurant.category}</a>
        </div>

        <div className="restaurantRating">
          <div className="gradeInfo row row-cols-auto">
            {/* <div className="gradeRating">
              별표시
              {[...Array(5)].map((_, index) => (
                <i key={index} className={`bi bi-star${index + 1 <= avgRating ? '-fill' : ''}`}></i>
              ))}
            </div> */}
            <span className="totalScore col">{avgRating}점</span>
            <p className="col">{reviewCount}명의 평가</p>
          </div>
        </div>
      </div>

      <div className="restaurantDetail">
        <ul>
          <li className="address ">
            <FaHouse className='iconHouse' />
            {restaurant.restaurantAddress}
            <button type="button" className=" btn btn-info text-light">
              지도보기
            </button>
          </li>
          <li className="number">
            <FaPhoneAlt />
            {restaurant.callNumber}
          </li>
          <li className="dtCategory">
            <BiSolidFoodMenu />
            {restaurant.category}
          </li>
          <li className="openTime">
            <MdAccessTimeFilled />
            {restaurant.openTime}
          </li>
          <li>
            <PiSirenFill />
            폐업신고 · 정보수정 제안
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DetailMain;

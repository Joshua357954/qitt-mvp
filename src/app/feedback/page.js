"use client"
import React, { useState } from 'react';
import { FaChevronLeft as Right, FaStar } from 'react-icons/fa';
import { BsSend as Chat } from 'react-icons/bs';
import MainLayout from '../../components/MainLayout.jsx';
import PageNav from '../../components/PageNav.jsx';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';

const StarRating = ({ rating, onRatingChange }) => {
  const handleStarClick = (selectedRating) => {
    onRatingChange(selectedRating);
  };

  return (
    <div className='flex items-center justify-center sm:flex-col md:flex-row gap-1'>
		<p style={{ marginRight: '8px' }}>Feel Free to Rate Us 😊:</p>

		<div className='flex items-center'>
			{[1, 2, 3, 4, 5].map((index) => (
				<FaStar
				key={index}
				fill={index <= rating ? 'gold' : 'gray'}
				onClick={() => handleStarClick(index)}
				style={{ cursor: 'pointer', marginRight: '8px' }}
				className='text-2xl'
				/>
			))}
		</div>
	</div>

  );
};

const FeedbackScreen = ({ className }) => {
  const minLength = 12
  const [ratingValue, setRatingValue] = useState(0)
  const [text, setText] = useState('')
  const [loading,setLoading] = useState(false)
  const userData = useSelector((state) => state.user);

  const handleRating = (rate) => {
    setRatingValue(rate);
  };

  const handleReset = () => {
    setRatingValue(0);
  };

  const sendFeedback = () => {
	// check review fit
	if (!text.trim()) {
		return toast.error('Please Write A Review', {
		  icon: '⚠️',
		  duration: 3000
		});
	} else if (text.trim().length < minLength) {
		return toast.error('Oops! Short review. Can you share more? 😊', {
		  icon: '⚠️',
		  duration: 3000
		});
	}

	let url = 'https://api.sheety.co/155adde26f27dac3cd7ad0a9ca54cbd7/qittApp/feedback';
	const stars = Array(ratingValue).fill('⭐').join('');
    
	const feedbackData = {
      'rating': stars || 0,
      'feedback': text.trim() || 'No Text',
      'username': userData.name || 'QITT',
      'email': userData.email || '1',
      'department': userData.department || 'KIT',
    };

	setLoading(true)
	console.log(feedbackData)

	// Process Review
	toast.promise(
		axios.post(url, { feedback: feedbackData }),
		{
		  loading: (res) => {
			return 'Sending feedback...'
		  },
		  // Successful Review
		  success: (response) => {    
			const responseData = response.data;
			console.log('Response:', responseData);
			setText('');
			setRatingValue(0);
			
			return 'Feedback Sent  💌';
		  },
		  error: (error) => { 
			setLoading(false)
			console.error('Error:', error.message)
			return 'Error sending feedback 🚫'
		  },
		}
	  );
	  setLoading(false)
  };

  return (
    <div className="w-full h-full">
      <section className="w-full relative h-full">
        <PageNav url="Feedback 😍" />
        <div className="bg-blue-20 h-[90%] w-full flex-col gap-y-4 flex items-center pt-12 ">
          <div className="h-14 w-14 flex justify-center items-center rounded-full bg-gray-900">
            <Chat className="text-yellow-400" size={25} onClick={sendFeedback} />
          </div>
          <div className="rounded-lg">
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="resize-none border-0 border-gray-200 pt-2 focus:outline-blue-400 h-fit w-62 p-2"
              placeholder="Click Here To Leave Us A Review, Thank You"
            />
          </div>
          <StarRating rating={ratingValue} onRatingChange={handleRating} />
        </div>
      </section>
	  {
		loading && <div className='z-1 fixed top-0 right-0 bg-[rgba(0,0,0,.1)]'>

		</div>
	  }
      <Toaster />
	  
    </div>
  );
};

export default FeedbackScreen;

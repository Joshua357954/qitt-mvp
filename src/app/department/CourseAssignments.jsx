import React from 'react';
import { Link } from 'react-router-dom'
import { BsImage, BsChevronLeft as Arrow  } from 'react-icons/bs'

 
const CourseAssignments = ({ className }) => {

	const data = [1,2,3,4,5]

    return (
        <main className="w-screen h-screen"> 
        	
        	<section className="w-full h-full">
        		
        		<div className="flex justify-between h-[9%] sm:h-[13%] bg-gray-800 items-center text-gray-100 px-2">
        			<Link to="/" className="flex gap-3 items-center hover:text-gray-100 font-medium text-gray-100"> <Arrow className="text-blue-400"/>  Back</Link>
        			<p className="text-blue-300 font-bold text-xl">Physics Assignments</p>
        			<small className="">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</small>
        		</div>

        		<div className="w-full h-[91%] sm:h-[87%] flex justify-center items-center">
        			
        			<div className="w-full sm:w-[60%]  px-3 pt-3  bg-gray-00 h-full overflow-y-auto ">

	    				
	    				{  data.map((item,idx) => {
	    					return <div key={idx} className="w-full mb-2 bg-gray-50 h-32 flex items-center border-lv-2 border-black  rounded">
	    					
		    					<div className="bg relative w-[35%] h-full bg-blue-300 rounded-tl rounded-bl">
		    						
		    						<div className=" absolute text-gray-700  wt left-5 sm:left-4 top-2  flex flex-col justify-center items-center w-[30%] ">
		        						<h2 className="font-black text-3xl ob">00{idx+1}</h2>
		        						{/*<p className="font-bold text-lg ob">23</p>*/}
		    						</div>
			    				</div>

								<div className="w-[70%] h-full flex flex-col px-3 pt-2 gap-y-1">
									<Link to="/assignment/physics" className="text-xl font-extrabold text-gray-700 space-x-5"> 1{idx}/4/{idx}4 </Link>
									<p className="font-medium flex gap-x-2 items-center justify-center bg-green-100 px-2 py-1 rounded-xl w-20"><BsImage className="text-green-500"/>JPG</p>
									<p className="font-light">22 days ago</p>
								</div>

				        	</div>})
				        }

			        </div>

			    </div>

        	</section>
        </main>
    );
};


export default CourseAssignments;

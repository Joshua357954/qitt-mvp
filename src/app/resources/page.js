"use client" 
import React, { useState } from 'react';

import { FaHeart, FaDownload } from 'react-icons/fa';
import { TbNotes as Notes } from 'react-icons/tb';
import { CgMoreVertical as More } from 'react-icons/cg';
import { PiDownloadBold as Download2, PiFiles as PQ, PiPencilLine as Assign } from 'react-icons/pi';
import MainLayout from '../../components/MainLayout.jsx';

const resourcesData = [
  { category: 'all' },
  {
    category: 'notes',
    items: [
      { title: 'Calculus', description: 'Quick formulas for Calculus.', link: '#' },
      { title: 'Kinematics', description: 'Comprehensive guide on motion.', link: '#' },
      { title: 'Biology', description: 'Detailed notes on mitosis and meiosis.', link: '#' },
    ],
  },
  {
    category: 'assignments',
    items: [
      { title: 'Mth 301', description: 'Solve quadratic equations.', link: '#' },
      { title: 'Chem ', description: 'Submit by next week.', link: '#' },
    ],
  },
  {
    category: 'past questions',
    items: [
      { title: 'STAT 101', description: 'Questions from 2015-2020.', link: '#' },
    ],
  },
  {
    category: 'others',
    items: [
      { title: 'Study', description: 'Plan your study routine.', link: '#' },
    ],
  },
];

const icons = {
  notes: <Notes className="text-green-500" />,
  'past questions': <PQ className="text-blue-500" />,
  assignments: <Assign className="text-purple-500" />,
  others: <More className="text-gray-500" />,
};

const ResourcesCard = ({ title, description, link }) => {
  return (
    <div className="bg-white relative h-48 max-h-52 rounded-xl shadow-lg">
      <div className="absolute -top-2 -right-1 flex flex-col justify-center gap-2 w-full h-48 bg-gray-50 rounded-xl shadow p-3 border border-gray-200">
        <div className="flex gap-1 flex-wrap">
          <div className="bg-green-500 flex justify-center items-center text-white font-semibold py-[.1rem] px-2 rounded-lg">Note</div>
          <div className="bg-blue-500 flex justify-center items-center text-white font-semibold py-[.1rem] px-2 rounded-lg uppercase">{title}</div>
        </div>

        <p className="text-sm font-medium text-gray-700">{description}</p>

        <div className="flex flex-col gap-1 items-start justify-between">
          <p className="text-sm font-medium">
            <b>By: </b>
            <span className="underline underline-offset-2">QittHQ</span>
          </p>
          <p className="text-sm font-medium">
            <b>Date: </b>
            <span className="underline underline-offset-2">18/2/2024</span>
          </p>
        </div>

        <a href={link} target="_blank" rel="noopener noreferrer">
          <Download2 className="text-xl absolute bottom-2 right-2 text-green-600 cursor-pointer" />
        </a>
      </div>
    </div>
  );
};

const Resources = ({ className }) => {
  const [resourceName, setResource] = useState('all');

  const filteredResources =
    resourceName === 'all'
      ? resourcesData.flatMap((category) => category.items || [])
      : resourcesData.find((category) => category.category === resourceName)?.items || [];

  return (
    <MainLayout route="Resources">
      <section className="flex flex-col gap-10 w-full h-full">
        <div className="w-full h-14 overflow-x-auto flex justify-start sm:justify-center gap-2">
          {resourcesData.map((item, index) => (
            <div
              key={index}
              onClick={() => setResource(item.category)}
              className={`p-3 ${
                item.category === resourceName ? 'px-4 font-bold border ' : ''
              } flex gap-1 items-center rounded-xl bg-gray-50 cursor-pointer`}
            >
              {icons[item.category]} <p className="whitespace-nowrap capitalize">{item.category}</p>
            </div>
          ))}
        </div>

        <div className="w-full bg-green-40 gap-6 h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {filteredResources.length > 0 ? (
            filteredResources.map((resource, index) => (
              <ResourcesCard
                key={index}
                title={resource.title}
                description={resource.description}
                link={resource.link}
              />
            ))
          ) : (
            <div className="flex items-center justify-center col-span-full">
              <p className="text-lg text-gray-600 text-center">
                Oops! It looks like <strong>we're all out of resources</strong> for now. <br />
                Don't worry, new content is on the way! 🚀 Check back later. ⏰
              </p>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Resources;

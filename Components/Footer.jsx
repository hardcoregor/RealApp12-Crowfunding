import React from 'react'

const Footer = () => {
  const productList = ["Market", "ERC20 Token", "Donation"];
  const contactList = [
    "hardco@gmail.com",
    "info@example.com",
    "Contact Us"
  ];
  const usefulLinks = ["Home", "About us", "Company Bio"];

  return (
    <footer className='text-center text-white backgroundMain lg:text-left'>
      <div className='mx-6 py-10 text-center md:text-left'>
        <div className='grid-1 grid gap-8 md:grid-cols-2 lg:grid-cols-4'>
          <div>
            <h6 className='mb-4 flex items-center justify-center font-semibold uppercase md:justify-start'>
              Hardcore King
            </h6>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut laboriosam, ipsam molestiae in porro praesentium cumque consequatur natus veniam? Officia quo omnis quas alias dicta voluptates quos quam expedita tempore!</p>
          </div>

          <div>
            <h6 className='mb-4 flex items-center justify-center font-semibold uppercase md:justify-start'>
              Products
            </h6>
            {productList.map((el, i) => (
              <p className='mb-4' key={i + 1}>
                <a href="#!">{el}</a>
              </p>
            ))}
          </div>

          <div>
            <h6 className='mb-4 flex items-center justify-center font-semibold uppercase md:justify-start'>
              Useful links
            </h6>
            {usefulLinks.map((el, i) => (
              <p className='mb-4' key={i + 1}>
                <a href="#!">{el}</a>
              </p>
            ))}
          </div>

          <div>
            <h6 className='mb-4 flex justify-center font-semibold uppercase md:justify-start'>
              Contact
            </h6>
            {contactList.map((el, i) => (
              <p className='mb-4' key={i + 1}>
                <a href="#!">{el}</a>
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className='backgroundMain p-6 text-center'>
        <span>2023 Copyright: </span>
        <a className='font-semibold' href="/">Hardcore King</a>
      </div>
    </footer>
  )
}

export default Footer
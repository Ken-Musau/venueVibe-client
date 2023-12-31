import React from 'react';

function AdditionalContent() {
  const infoStyle = {
    color: 'rgba(0, 0, 0, 0.60)',
    fontSize: '1.5rem',
    fontFamily: 'Inter',
    fontWeight: '500',
    lineHeight: '2rem',
    wordWrap: 'break-word',
  };

  return (
    <div>
      <h3 style={infoStyle}> Contact Details</h3>
      <p style={infoStyle}> Email: <a href="mailto:info@venuevibe.com">info@venuevibe.com</a></p>
      <p style={infoStyle}> Phone: (252) 555-0126</p>
      <p style={infoStyle}> Address: 6391 Elgin St. Celina, Delaware 10299</p>
    </div>
  );
}

export default AdditionalContent;
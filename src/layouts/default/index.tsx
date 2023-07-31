import React from 'react';
import Header from './header';
import SiderApp from './navbar';
import BreadCrumbApp from './breadcrumb';

const DefaultLayout = ({ children }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-shrink-0">
        <Header />
      </div>
      <div className="flex h-full overflow-hidden">
        <div>
          <SiderApp />
        </div>
        <div className="h-full w-fit bg-gray-100 overflow-hidden p-5 flex flex-col flex-1">
          <BreadCrumbApp />
          <div className="overflow-hidden h-full">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DefaultLayout;

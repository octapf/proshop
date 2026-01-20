import React from 'react';
import { Pagination } from 'react-bootstrap';
import Link from 'next/link';

const Paginate = ({ pages, page, isAdmin = false, keyword = '' }: any) => {
  return (
    pages > 1 && (
      <Pagination>
        {[...Array(pages).keys()].map((x) => (
          <li className={`page-item ${x + 1 === page ? 'active' : ''}`} key={x + 1}>
            <Link
              className="page-link"
              href={
                isAdmin
                  ? `/admin/productlist/?pageNumber=${x + 1}`
                  : keyword
                    ? `/search/${keyword}/page/${x + 1}`
                    : `/page/${x + 1}`
              }
            >
              {x + 1}
            </Link>
          </li>
        ))}
      </Pagination>
    )
  );
};

export default Paginate;

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
      <div className="max-w-md">
        <p className="text-sm font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2">
          404 Error
        </p>
        <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight mb-3">
          Page Not Found
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
          The requested route does not exist or you may not possess sufficient role permissions to access it.
        </p>
        <Link to="/">
          <Button variant="secondary" leftIcon={Home}>
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

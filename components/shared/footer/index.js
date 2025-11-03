import { APP_NAME } from '@/lib/constants';

const Footer = ({ year }) => {
  return (
    <footer className="border-t">
      <div className="p-5 flex-center">
        {year} {APP_NAME}. All Rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

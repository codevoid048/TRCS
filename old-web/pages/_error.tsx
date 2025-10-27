import { NextPage } from 'next';
import { ErrorProps } from 'next/error';
import Head from 'next/head';
import Link from 'next/link';

const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
    return (
        <>
            <Head>
                <title>Error {statusCode} | The Raja Cycle Stores</title>
            </Head>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-xl dark:bg-gray-800">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400">
                            Error {statusCode}
                        </h1>
                        <p className="mt-3 text-lg text-gray-700 dark:text-gray-300">
                            {statusCode === 404
                                ? "The page you're looking for doesn't exist."
                                : "We're sorry, something went wrong on our end."}
                        </p>
                    </div>
                    <div className="mt-8">
                        <Link
                            href="/"
                            className="block w-full rounded-md bg-primary-main py-3 text-center font-medium text-white hover:bg-primary-light transition-colors"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

ErrorPage.getInitialProps = ({ res, err }: any) => {
  // Ensure statusCode is always a number (default to 404)
  const statusCode = res && res.statusCode ? res.statusCode : 
                    err && err.statusCode ? err.statusCode : 404;
  return { statusCode } as ErrorProps;
};

export default ErrorPage;
import { Search } from "lucide-react";

type InsightSearchProps = {
    handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export default function InsightSearch({handleSearch, setSearch} : InsightSearchProps): JSX.Element {
    return (
        <div className="mb-6 lg:mb-0 lg:p-6 bg-gray-50 border-gray-200 border-[1px] shadow-sm p-4 rounded-md">
            <p className="text-sm lg:text-lg font-bold mb-4">Search</p>
            <div className='relative flex flex-col'>
                <form onSubmit={(e) => handleSearch(e)}>
                    <input onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search blog posts" className="w-full border text-sm lg:text-base border-gray-200 rounded-lg px-4 py-2 ps-9 bg-white" />
                    <Search className='top-2 left-2 absolute text-gray-600 h-5 lg:h-6' />
                </form>
            </div>
        </div>
    )
}
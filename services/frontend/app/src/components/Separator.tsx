interface Separator {
    className?: string;
}

const Separator = () => {
    return (
        
            <>
                <div className="absolute top-28 md:top-[25%] left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent blur-[1px] opacity-70"></div>
            
                <div className="absolute bottom-24 md:bottom-[25%] left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent blur-[1px] opacity-70"></div>
            </>
    );
};

export default Separator;
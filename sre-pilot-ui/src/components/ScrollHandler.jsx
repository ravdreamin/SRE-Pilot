import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollHandler = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            // If there is a hash, try to scroll to the element
            const id = hash.replace("#", "");

            // Small timeout to ensure DOM is ready (especially if coming from another page)
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            }, 100);
        } else {
            // If no hash, scroll to top of page
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollHandler;

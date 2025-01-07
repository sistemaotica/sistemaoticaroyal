import { Desktop } from "./desktop";
import { Mobile } from "./mobile";

export function Sidebar(){
    return(
        <div className="flex w-full flex-col bg-muted/40">
            <Desktop/>
            <Mobile/>
        </div>
    );
}
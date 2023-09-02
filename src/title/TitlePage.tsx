import { Link } from "react-router-dom";

export default function TitlePage() {
    return (
        <div>
            <h1>Browser Fighting Game Title Page</h1>
            <Link to="lobby-selection">
                <button>Start</button>
            </Link>
            {/* TODO: Divide this information into clusters and space appropriately */}
            <h2>Credits</h2>
            <h3>Created by:</h3>
            <p>Sam Thompson</p>
            <p>See this project on GitHub!</p>
            <a href="https://github.com/samuel-thompsonn/browser-fighting-game-client">Client</a><p></p>
            <a href="https://github.com/samuel-thompsonn/browser-fighting-game-server">Server</a>
            <p>CDK</p>

        </div>
    )
}

import React from 'react';

const TeamPage = ({team}) => {
    return (
        <div>
            Welcome to Team dashboard Page...
            {team.map((article, key) => (
                <h2>{article.teamname}</h2>
            ))} 
        </div>
    )
}

export default TeamPage;
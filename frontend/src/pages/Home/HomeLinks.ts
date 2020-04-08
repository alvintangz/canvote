import { UserRole } from '../../enums/role';

export default [
    {
        "role": UserRole.administrator,
        "links": [
            {
                "title": "Manage Election",
                "description": "Manage political parties, candidates, and districts for the ongoing election.",
                "linkTo": "/manage/election"
            },
            {
                "title": "Manage Election Officers",
                "description": "Manage election officers for the election.",
                "linkTo": "/manage/users"
            },
        ]
    },
    {
        "role": UserRole.election_officer,
        "links": [
            {
                "title": "Manage Voters",
                "description": "Manage voters for the election.",
                "linkTo": "/manage/users"
            },
        ]
    },
    {
        "role": UserRole.voter,
        "links": [
            {
                "title": "Vote",
                "description": "Vote",
                "linkTo": "/vote"
            },
            {
                "title": "Election results",
                "description": "View the live election results.",
                "linkTo": "/live-results"
            },
        ]
    },
];

import { UserRole } from '../../../enums/role';

export default [
    {
        "role": UserRole.administrator,
        "links": [
            {
                "title": "Manage Political Parties",
                "description": "Manage political parties for the election.",
                "linkTo": "/manage/parties"
            },
            {
                "title": "Manage Candidates",
                "description": "Manage candidates for the election.",
                "linkTo": "/manage/candidates"
            },
            {
                "title": "Manage Districts",
                "description": "Manage districts for the election.",
                "linkTo": "/manage/districts"
            },
            {
                "title": "Manage Election Officer",
                "description": "Manage election officers for the election.",
                "linkTo": "/manage/users"
            },
        ]
    },
    {
        "role": UserRole.election_officer,
        "links": [
            {
                "title": "Manage voters",
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

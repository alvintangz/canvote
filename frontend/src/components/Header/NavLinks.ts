import {UserRole} from '../../enums/role';

export default [
    {
        "role": UserRole.administrator,
        "links": [
            {
                "title": "Manage Election",
                "linkTo": "/manage/election"
            },
            {
                "title": "Manage Election Officers",
                "linkTo": "/manage/users"
            },
            {
                "title": "Election results",
                "linkTo": "/live-results"
            },
        ]
    },
    {
        "role": UserRole.election_officer,
        "links": [
            {
                "title": "Manage Voters",
                "linkTo": "/manage/users"
            },
            {
                "title": "Election results",
                "linkTo": "/live-results"
            },
        ]
    },
    {
        "role": UserRole.voter,
        "links": [
            {
                "title": "Vote",
                "linkTo": "/vote"
            },
            {
                "title": "Election results",
                "linkTo": "/live-results"
            },
        ]
    },
    {
        "role": UserRole.anonymous,
        "links": [
            {
                "title": "Election results",
                "linkTo": "/live-results"
            },
        ]
    }
];

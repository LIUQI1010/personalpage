export const skills = {
  'Cloud & AWS': {
    basic: ['Amazon Cognito', 'AWS Lambda', 'API Gateway', 'DynamoDB', 'S3', 'IAM'],
    detailed: [
      'Serverless Architecture',
      'AWS Cognito Authentication',
      'API Gateway + Lambda Integration',
      'IAM Policies & RBAC',
      'S3 Static Hosting',
      'DynamoDB Design Patterns',
    ],
  },
  Programming: {
    basic: ['Python', 'JavaScript', 'HTML/CSS', 'React'],
    detailed: [
      'Python Scripting & Automation',
      'JavaScript ES6+',
      'HTML5 & CSS3',
      'React Hooks & Context',
      'Responsive Design',
    ],
  },
  Database: {
    basic: ['SQL', 'MySQL', 'NoSQL', 'DynamoDB'],
    detailed: [
      'MySQL Query Optimization',
      'DynamoDB Design Patterns',
      'SQL Joins & Indexing',
      'NoSQL Document Design',
      'Data Modeling',
    ],
  },
  Tools: {
    basic: ['Git', 'GitHub', 'Unix/Linux CLI', 'VS Code', 'IntelliJ IDEA'],
    detailed: [
      'Git Workflow & Branching',
      'GitHub Version Control',
      'Unix/Linux CLI',
      'VS Code Extensions',
      'IntelliJ IDEA Debugging',
    ],
  },
};

export const certifications = [
  {
    name: 'Foundational C# with Microsoft',
    issuer: 'freeCodeCamp',
    status: 'completed',
    year: '2023',
    credlyImageUrl: '/Csharp certification.png',
    credlyVerifyUrl: 'https://freecodecamp.org/certification/QiLiu/foundational-c-sharp-with-microsoft',
  },
  {
    name: 'Solutions Architect Associate',
    issuer: 'AWS',
    status: 'completed',
    year: '2025',
    credlyImageUrl:
      'https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
    credlyVerifyUrl: 'https://www.credly.com/badges/4f9b68d1-68e3-480f-857c-c63d6464694f',
    credlyEmbedId: '4f9b68d1-68e3-480f-857c-c63d6464694f',
  },
  {
    name: 'Cloud Practitioner',
    issuer: 'AWS',
    status: 'completed',
    year: '2024',
    credlyImageUrl: '/img/cloud foundation.png',
    credlyVerifyUrl: '',
  },
  {
    name: 'Developer Associate',
    issuer: 'AWS',
    status: 'preparing',
    year: 'In Progress',
    credlyImageUrl: '',
    credlyVerifyUrl: '',
  },
];

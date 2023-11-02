CREATE TABLE `Tool` (
  `tool_id` STR,
  `tool` STR,
  `created_date` STR
);

CREATE TABLE `Result` (
  `result_id` STR,
  `result` Dynamic,
  `created` Bool
);

CREATE TABLE `Comment` (
  `url` STR,
  `name` STR,
  `content` STR,
  `created_date` STR,
  `note` STR,
  `case_id` STR
);

CREATE TABLE `Wallet` (
  `wallet` STR,
  `wallet_type` STR,
  `note` STR,
  `url` STR,
  `case_id` STR
);

CREATE TABLE `Person` (
  `name` STR,
  `fake` STR,
  `note` STR,
  `url` STR,
  `case_id` STR
);

CREATE TABLE `Email` (
  `email` STR,
  `fake` STR,
  `note` STR,
  `url` STR,
  `case_id` STR
);

CREATE TABLE `DarkUser` (
  `username` STR,
  `rank` STR,
  `regdate` STR,
  `post_num` INT,
  `comment_num` INT,
  `registered` List,
  `note` STR,
  `url` STR,
  `case_id` STR
);

CREATE TABLE `Company` (
  `name` STR,
  `fake` STR,
  `business_num` STR,
  `note` STR,
  `url` STR,
  `case_id` STR
);

CREATE TABLE `Message` (
  `sender` STR,
  `content` STR,
  `date` STR,
  `note` STR,
  `case_id` STR
);

CREATE TABLE `Post` (
  `url` STR,
  `title` STR,
  `writer` STR,
  `content` STR,
  `created_date` STR,
  `post_type` STR,
  `note` STR,
  `case_id` STR
);

CREATE TABLE `Case` (
  `case_id` STR,
  `case_number` STR,
  `details` STR,
  `investigator` STR,
  `create_date` STR,
  `etc` STR,
  `runs` Run LIST
);

CREATE TABLE `Run` (
  `run_id` STR,
  `status` STR,
  `runtime` STR,
  `tool_id` Tool,
  `input_value` STR,
  `results` Result List
);

CREATE TABLE `SurfaceUser` (
  `username` STR,
  `fake` STR,
  `registered` List,
  `note` STR,
  `url` STR,
  `case_id` STR
);

CREATE TABLE `Domain` (
  `domain` STR,
  `regdate` STR,
  `status` STR,
  `note` STR,
  `case_id` STR
);

CREATE TABLE `Phone` (
  `number` STR,
  `note` STR,
  `url` STR,
  `case_id` STR
);


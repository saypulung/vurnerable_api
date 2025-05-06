#### Security Programming

This repository is the example of the implementation security programming. Basicly, I created a branch with vulnerable and fixing the security issue in another branch.
Currently, I provide example with issue URL Parameter tampering at the endpoint `/project_by_group`. In the vurnerable_api_project branch, I create hole user need to pass group_id when get a project in a group.
It is not good if the other user with different group can see a list of project in another group. If the requirement user only see project(s) in same group, we should prevent URL parameter tampering by remove [ID] segment from URL.

In the main branch, the API already safe.

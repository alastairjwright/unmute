Git
===
##Workflow

###Branches
There should be a branch for each environment, if there isn't please add them.  Each branch represents the current state of the corresponding environment.

In most cases there will be:
* development
* staging
* production (master branch)

New features that require time to build will be on their own branch, using the feature-short-description prefixed naming convention.

When complete, features will be merged into development branch, deployed, and tested.  Once tests have passed, develoment will be merged into staging, deployed and tested.  The same steps are repeated from staging to production.

After a feature branch has passed all tests and deployed to production, the master branch should be tagged and the feature branch deleted.

###Tagging
Tags should follow major.minor convention.  For example, site launch gets tagged as 1.0, a feature would be tagged as 1.1, a phase 2 would get tagged as 2.0, and a redesign would get tagged as 3.0.

##Commands
Best to always `git pull` before committing, this avoids having to merge master branch into itself.  `git commit --int` is the preferred method for committing code as you'll have a chance to quickly review code before committing and avoiding complications around accidental file changes.  Please do not use `git commit -am 'message'`.
###Branches
* `git remote prune origin` - prunes origin of any branches that have been deleted by another user.  It's good to run this command if you've had a repo checked out for a while and have been inactive.
* `git branch -a` - list all current branches
* `git checkout branchname` - checks out an existing branch

**New Branch**

Basic branching assuming you want to branch from master with latest from HEAD.  After creating a branch, you must sync it with the origin.

    git checkout master
    git pull
    git checkout -b feature-branchname
    git push --set-upstream origin feature-branchname

**Delete Branch**

Just like creating a new branch, you must sync it with the origin after deleting.

    git branch -d branchname
    git push origin --delete branchname

**Merge Branch**

Example of merging development branch into staging branch.  This assumes there are no conflicts.  Git will notify you of conflicting files, you'll have to manually fix any conflicts and `git -a path/to/file` after you've fixed conflicts and before you can push.

    git checkout staging
    git merge development
    git push

###Tagging
Tagging should be done on the master branch.

**Create Tag**

    git tag -a v1.0 -m 'Site Launch'
    git push origin v1.0

**Delete Tag**

    git tag -d v1.0
    git push origin :refs/tags/v.10

###Transferring a Repository

Example of transferring a repository from GitHub to Beanstalk.

    git clone --bare https://github.com/path/to/old-repo.git
    cd *old-repo.git*
    git push --mirror https://beanstalkapp.com/path/to/new-repo.git
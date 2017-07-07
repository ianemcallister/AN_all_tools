# Ah-Nuts Corporate Tools

The purpose of this application is to take some of the work off my shoulders.  There are a couple of tools that I use regularly that I would like to automate

1. Earnings Calculator
2. Sales Accounting Helper
3. Inventory Tracking

Each of these will require several resources

**Access to the square API for all sales data and timesheets

**Access to firebase, the database, where all project data will be stored, from schedules, to employee deals, to inventory, to historic sales data

EARNINGS CALCULATOR
In order to calculate an employee's earnings we have to move though the following steps.

1. What hours did they work?
2. What was their role during those hours?
3. Which of those hours were scheduled sales hours?
4. What is their pay rate for the role they played?
5. What are their commission tiers for the role they played?
6. What were the sales volumes during the hours they worked?

From this information we can calucate

1. Their total shift base pay, regular time, earnings
2. Their total shift base pay, time and a half, earnings
3. Their total shift commissions
4. Their average hourly rate

In order to calculate this data we should follow the algorithm below:

1. Download all reference data:
	a. total scheduled hours
	b. scheduled sales hours
	c. actual worked hours
	d. shift role (cooker, seller, solo)
	e. base pay rate ($/hr)
	f. commission tiers (>=$100/hr -> $15/hr, >=$150/hr -> $20/hr, etc.)
	g. total hours worked over last 7 days
	h. sales recorded during hours worked
2. Calculate guranteed earnings based on scheduled hours
3. Check for discrepency time based on clock-in, clock-out
4. Calculate commissions earned based on sales volumes and commission tiers
5. Calculate total shift pay
6. Calculate average hourly rate for shift

If there is a discrepency in hours supervisor should approve discrepency before earnings emails are issued.


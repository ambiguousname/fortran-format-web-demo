module formatting
	implicit none
	type stdio
	integer :: i
	end type
contains
end module formatting

subroutine write_fmt(fmt_stmt, out)
	character(len=*), intent(INOUT) :: out
	character(len=*), intent(IN) :: fmt_stmt
	integer :: a, b, c
	! class(stdio), intent(IN) :: variables

	write(out, fmt_stmt) a, b, c
end
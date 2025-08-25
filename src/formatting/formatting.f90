integer function test(b) result(a)
	integer, intent(IN) :: b
	print*, b
	a = b
end

subroutine write_fmt(fmt_stmt, out)
	character(len=*), intent(INOUT) :: out
	character(len=*), intent(IN) :: fmt_stmt
	write(out, fmt_stmt)
end
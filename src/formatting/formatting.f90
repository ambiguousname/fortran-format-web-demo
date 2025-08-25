integer function test(b) result(a)
	integer, intent(IN) :: b
	print*, b
	a = b
end

subroutine write_fmt(out)
	character(len=*), intent(INOUT) :: out
	write(out, '("Co")')
end